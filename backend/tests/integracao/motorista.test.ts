import { faker } from "@faker-js/faker";
import moment from "moment";
import supertest from "supertest";
import app from "../../src/app.js";
import Motorista from "../../src/models/Motorista.js";
import Usuario from "../../src/models/Usuario.js";
import type { CriarMotoristaType } from "../../src/types/motoristaTypes.js";

const server = supertest(app);

describe("Testes de integração - Motoristas", () => {
	let token: string;

	const gerarMotorista = (): CriarMotoristaType => ({
		nome: faker.person.fullName(),
		cpf: "219.120.438-40",
		cnh: {
			numero: "80757003275",
			validade: moment().add(1, "year").toDate(),
		},
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
	});

	describe("POST /api/motoristas", () => {
		it("deve criar um novo motorista", async () => {
			const motorista = gerarMotorista();
			const response = await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("_id");
			expect(response.body.nome).toBe(motorista.nome);
			expect(response.body.cpf).toBe(motorista.cpf.replace(/[^0-9]/g, ""));
		});

		it("deve retornar erro ao criar motorista com CNH vencida", async () => {
			const motorista = gerarMotorista();
			motorista.cnh.validade = moment().subtract(1, "day").toDate();

			const response = await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);

			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty("erro", "A CNH do motorista está vencida");
		});

		it("deve retornar erro ao criar motorista com CPF inválido", async () => {
			const motorista = gerarMotorista();
			motorista.cpf = "123.456.789-00";

			const response = await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);

			expect(response.status).toBe(400);
		});
	});

	describe("GET /api/motoristas", () => {
		it("deve listar motoristas com sucesso", async () => {
			const motorista = gerarMotorista();
			await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);

			const response = await server.get("/api/motoristas").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("dados");
			expect(response.body).toHaveProperty("paginacao");
			expect(response.body.dados.length).toBeGreaterThan(0);
		});

		it("deve filtrar motoristas por nome", async () => {
			const motorista = gerarMotorista();
			await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);

			const response = await server.get(`/api/motoristas?nome=${motorista.nome}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].nome).toBe(motorista.nome);
		});
	});

	describe("GET /api/motoristas/:id", () => {
		it("deve buscar motorista por ID", async () => {
			const motorista = gerarMotorista();
			const createResponse = await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);

			const response = await server.get(`/api/motoristas/${createResponse.body._id}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.nome).toBe(motorista.nome);
		});

		it("deve retornar 404 para ID inexistente", async () => {
			const response = await server.get("/api/motoristas/64a7b7d77e71ee3e989f1234").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(404);
		});
	});

	describe("PUT /api/motoristas/:id", () => {
		it("deve atualizar motorista com sucesso", async () => {
			const motorista = gerarMotorista();
			const createResponse = await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);

			const novosDados = {
				nome: faker.person.fullName(),
				cnh: {
					validade: moment().add(2, "years").toDate(),
				},
			};

			const response = await server
				.put(`/api/motoristas/${createResponse.body._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send(novosDados);

			expect(response.status).toBe(200);
			expect(response.body.nome).toBe(novosDados.nome);
		});
	});

	describe("DELETE /api/motoristas/:id", () => {
		it("deve deletar motorista com sucesso", async () => {
			const motorista = gerarMotorista();
			const createResponse = await server.post("/api/motoristas").set("Authorization", `Bearer ${token}`).send(motorista);

			const response = await server.delete(`/api/motoristas/${createResponse.body._id}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("mensagem", "Motorista removido com sucesso");

			const motoristaExiste = await Motorista.findById(createResponse.body._id);
			expect(motoristaExiste).toBeNull();
		});
	});

	afterEach(async () => {
		await Motorista.deleteMany({});
	});

	afterAll(async () => {
		await Usuario.deleteMany({});
	});
});
