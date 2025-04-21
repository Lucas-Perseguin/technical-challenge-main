import { faker } from "@faker-js/faker";
import moment from "moment";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../src/app.js";
import Motorista from "../../src/models/Motorista.js";
import Usuario from "../../src/models/Usuario.js";
import Veiculo from "../../src/models/Veiculo.js";
import Viagem from "../../src/models/Viagem.js";
import type { CriarViagemType } from "../../src/types/viagemTypes.js";

const server = supertest(app);

describe("Testes de integração - Viagens", () => {
	let token: string;
	let motoristaId: string;
	let veiculoId: string;

	const gerarViagem = (): CriarViagemType => ({
		origem: faker.location.city(),
		destino: faker.location.city(),
		dataPartida: moment().add(1, "day").hours(9).toDate(),
		previsaoChegada: moment().add(2, "days").hours(9).toDate(),
		status: "Planejada",
		motorista: motoristaId as unknown as mongoose.Schema.Types.ObjectId,
		veiculo: veiculoId as unknown as mongoose.Schema.Types.ObjectId,
	});

	beforeAll(async () => {
		await Usuario.deleteMany({});
		const admin = {
			nome: faker.person.fullName(),
			email: faker.internet.email(),
			cpf: "219.120.438-40",
			senha: "senha123",
			admin: true,
		};

		await server.post("/api/usuarios").send(admin);
		const loginResponse = await server.post("/api/usuarios/login").send({ cpf: admin.cpf, senha: admin.senha });

		token = loginResponse.body.token;

		await Motorista.deleteMany({});
		const motorista = {
			nome: faker.person.fullName(),
			cpf: "219.120.438-40",
			cnh: {
				numero: "80757003275",
				validade: moment().add(1, "year").hours(9).toDate(),
			},
		};
		const motoristaResponse = await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);
		motoristaId = motoristaResponse.body._id;

		await Veiculo.deleteMany({});
		const veiculo = {
			modelo: faker.vehicle.model(),
			placa: "ABC-1234",
			tipoVeiculo: "Caminhão",
			tipoCapacidade: "Kilogramas",
			capacidade: 1000,
		};
		const veiculoResponse = await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);
		veiculoId = veiculoResponse.body._id;
	});

	describe("POST /api/viagens", () => {
		it("deve criar uma nova viagem", async () => {
			const viagem = gerarViagem();

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("_id");
			expect(response.body.motorista).toBe(motoristaId);
			expect(response.body.veiculo).toBe(veiculoId);
		});

		it("deve retornar erro ao criar viagem com CNH vencida antes da previsão de chegada", async () => {
			await Motorista.findByIdAndUpdate(motoristaId, {
				"cnh.validade": moment().hours(9).toDate(),
			});

			const viagem = gerarViagem();

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			await Motorista.findByIdAndUpdate(motoristaId, {
				"cnh.validade": moment().add(1, "year").hours(9).toDate(),
			});
			expect(response.status).toBe(400);
			expect(JSON.parse(response.text).erro).toContain("CNH do motorista");
		});

		it("deve retornar erro quando previsão de chegada for anterior à partida", async () => {
			const viagem = {
				...gerarViagem(),
				dataPartida: moment().add(2, "days").hours(9).toDate(),
				previsaoChegada: moment().add(1, "days").hours(9).toDate(),
			};

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			expect(response.status).toBe(400);
		});

		it("deve retornar erro ao criar viagem com campos faltando", async () => {
			const viagem = {
				origem: faker.location.city(),
			};

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			expect(response.status).toBe(400);
		});

		it("deve retornar erro ao criar viagem com status inválido", async () => {
			const viagem = {
				...gerarViagem(),
				status: "InvalidStatus",
			};

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			expect(response.status).toBe(400);
		});

		it("deve retornar erro ao criar viagem com motorista inexistente", async () => {
			const viagem = {
				...gerarViagem(),
				motorista: "64a7b7d77e71ee3e989f1234",
			};

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			expect(response.status).toBe(404);
			expect(JSON.parse(response.text).erro).toBe("Motorista não encontrado");
		});

		it("deve retornar erro ao criar viagem com veículo inexistente", async () => {
			const viagem = {
				...gerarViagem(),
				veiculo: "64a7b7d77e71ee3e989f1234",
			};

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			expect(response.status).toBe(404);
			expect(JSON.parse(response.text).erro).toBe("Veículo não encontrado");
		});

		it("deve retornar erro ao criar viagem com data de partida no passado para status Planejada", async () => {
			const viagem = {
				...gerarViagem(),
				dataPartida: moment().subtract(1, "day").hours(9).toDate(),
				status: "Planejada",
			};

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			expect(response.status).toBe(400);
			expect(JSON.parse(response.text).erro).toContain("data de partida não pode ser anterior");
		});

		it("deve retornar erro ao criar viagem com data de partida no futuro para status Em andamento", async () => {
			const viagem = {
				...gerarViagem(),
				dataPartida: moment().add(1, "day").hours(9).toDate(),
				status: "Em andamento",
			};

			const response = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			expect(response.status).toBe(400);
			expect(JSON.parse(response.text).erro).toContain("data de partida não pode ser posterior");
		});
	});

	describe("GET /api/viagens", () => {
		it("deve listar viagens com sucesso", async () => {
			const viagem = gerarViagem();

			await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);
			const response = await server.get("/api/viagens").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("dados");
			expect(response.body).toHaveProperty("paginacao");
			expect(response.body.dados.length).toBeGreaterThan(0);
		});

		it("deve filtrar viagens por motorista", async () => {
			const viagem = gerarViagem();

			await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const motorista = await Motorista.findById(motoristaId);
			const response = await server.get(`/api/viagens?motorista=${motorista!.nome}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].motoristaInfo.nome).toBe(motorista!.nome);
		});

		it("deve filtrar viagens por status", async () => {
			const viagem = gerarViagem();
			await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const response = await server.get(`/api/viagens?status=${viagem.status}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].status).toBe(viagem.status);
		});

		it("deve filtrar viagens por placa do veículo", async () => {
			const viagem = gerarViagem();
			await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const response = await server.get("/api/viagens?placa=ABC-1234").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].veiculoInfo.placa).toBe("ABC-1234");
		});

		it("deve retornar paginação correta", async () => {
			const viagens = Array(15)
				.fill(null)
				.map(() => gerarViagem());
			await Promise.all(
				viagens.map((viagem) => server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem)),
			);

			const response = await server.get("/api/viagens?page=2&limit=10").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados.length).toBeLessThanOrEqual(10);
			expect(response.body.paginacao.paginasTotal).toBe(2);
		});
	});

	describe("GET /api/viagens/motorista/:id", () => {
		it("deve listar viagens do motorista", async () => {
			const viagem = gerarViagem();

			await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const response = await server.get(`/api/viagens/motorista/${motoristaId}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].motorista).toBe(motoristaId);
		});

		it("deve retornar 404 quando não houver viagens para o motorista", async () => {
			const response = await server
				.get(`/api/viagens/motorista/${new mongoose.Types.ObjectId()}`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(404);
			expect(JSON.parse(response.text).erro).toBe("Nenhuma viagem encontrada");
		});

		it("deve filtrar viagens do motorista por placa", async () => {
			const viagem = gerarViagem();
			await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const response = await server
				.get(`/api/viagens/motorista/${motoristaId}?placa=ABC-1234`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].veiculoInfo.placa).toBe("ABC-1234");
		});
	});

	describe("GET /api/viagens/veiculo/:id", () => {
		it("deve listar viagens do veículo", async () => {
			const viagem = gerarViagem();
			await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const response = await server.get(`/api/viagens/veiculo/${veiculoId}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].veiculo).toBe(veiculoId);
		});

		it("deve filtrar viagens do veículo por motorista", async () => {
			const viagem = gerarViagem();
			await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const motorista = await Motorista.findById(motoristaId);
			const response = await server
				.get(`/api/viagens/veiculo/${veiculoId}?motorista=${motorista!.nome}`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].motoristaInfo.nome).toBe(motorista!.nome);
		});
	});

	describe("PUT /api/viagens/:id", () => {
		it("deve atualizar viagem com sucesso", async () => {
			const viagem = gerarViagem();

			const createResponse = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const novosDados = {
				...viagem,
				origem: "Nova Origem",
				destino: "Novo Destino",
			};

			const response = await server
				.put(`/api/viagens/${createResponse.body._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send(novosDados);

			expect(response.status).toBe(200);
			expect(response.body.origem).toBe("Nova Origem");
			expect(response.body.destino).toBe("Novo Destino");
		});

		it("deve retornar erro ao atualizar viagem inexistente", async () => {
			const response = await server
				.put(`/api/viagens/${new mongoose.Types.ObjectId()}`)
				.set("Authorization", `Bearer ${token}`)
				.send(gerarViagem());

			expect(response.status).toBe(404);
			expect(JSON.parse(response.text).erro).toBe("Viagem não encontrada");
		});

		it("deve atualizar status da viagem", async () => {
			const viagem = gerarViagem();
			const createResponse = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const novosDados = {
				...viagem,
				status: "Em andamento",
				dataPartida: moment().subtract(1, "day").hours(9).toDate(),
			};

			const response = await server
				.put(`/api/viagens/${createResponse.body._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send(novosDados);

			expect(response.status).toBe(200);
			expect(response.body.status).toBe("Em andamento");
		});
	});

	describe("DELETE /api/viagens/:id", () => {
		it("deve deletar viagem com sucesso", async () => {
			const viagem = gerarViagem();

			const createResponse = await server.post("/api/viagens").set("Authorization", `Bearer ${token}`).send(viagem);

			const response = await server.delete(`/api/viagens/${createResponse.body._id}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("mensagem", "Viagem removida com sucesso");

			const viagemExiste = await Viagem.findById(createResponse.body._id);
			expect(viagemExiste).toBeNull();
		});
	});

	afterEach(async () => {
		await Viagem.deleteMany({});
	});

	afterAll(async () => {
		await Motorista.deleteMany({});
		await Veiculo.deleteMany({});
		await Usuario.deleteMany({});
	});
});
