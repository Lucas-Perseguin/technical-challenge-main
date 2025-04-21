import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app.js";
import Usuario from "../../src/models/Usuario.js";
import Veiculo from "../../src/models/Veiculo.js";
import type { CriarVeiculoType } from "../../src/types/veiculoTypes.js";

const server = supertest(app);

describe("Testes de integração - Veículos", () => {
	let token: string;

	const gerarVeiculo = (): CriarVeiculoType => ({
		modelo: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
		placa: faker.vehicle.vrm(),
		tipoVeiculo: "Caminhão",
		tipoCapacidade: "Kilogramas",
		capacidade: faker.number.int({ min: 100, max: 10000 }),
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

	describe("POST /api/veiculos", () => {
		it("deve criar um novo veículo", async () => {
			const veiculo = gerarVeiculo();
			const response = await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("_id");
			expect(response.body.modelo).toBe(veiculo.modelo);
			expect(response.body.placa).toBe(veiculo.placa);
		});

		it("deve retornar erro ao criar veículo com placa duplicada", async () => {
			const veiculo = gerarVeiculo();

			await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			const response = await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			expect(response.status).toBe(400);
		});

		it("deve retornar erro ao criar veículo com tipo inválido", async () => {
			const veiculo = gerarVeiculo();
			veiculo.tipoVeiculo = "Moto" as any;

			const response = await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			expect(response.status).toBe(400);
		});
	});

	describe("GET /api/veiculos", () => {
		it("deve listar veículos com sucesso", async () => {
			const veiculo = gerarVeiculo();
			await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			const response = await server.get("/api/veiculos").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("dados");
			expect(response.body).toHaveProperty("paginacao");
			expect(response.body.dados.length).toBeGreaterThan(0);
		});

		it("deve filtrar veículos por modelo", async () => {
			const veiculo = gerarVeiculo();
			await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			const response = await server.get(`/api/veiculos?modelo=${veiculo.modelo}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.dados[0].modelo).toBe(veiculo.modelo);
		});
	});

	describe("GET /api/veiculos/:id", () => {
		it("deve buscar veículo por ID", async () => {
			const veiculo = gerarVeiculo();
			const createResponse = await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			const response = await server.get(`/api/veiculos/${createResponse.body._id}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.modelo).toBe(veiculo.modelo);
		});

		it("deve retornar 404 para ID inexistente", async () => {
			const response = await server.get("/api/veiculos/64a7b7d77e71ee3e989f1234").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(404);
		});
	});

	describe("PUT /api/veiculos/:id", () => {
		it("deve atualizar veículo com sucesso", async () => {
			const veiculo = gerarVeiculo();
			const createResponse = await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			const novosDados = {
				modelo: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
				tipoVeiculo: "Van",
				tipoCapacidade: "Litros",
				capacidade: 1000,
			};

			const response = await server
				.put(`/api/veiculos/${createResponse.body._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send(novosDados);

			expect(response.status).toBe(200);
			expect(response.body.modelo).toBe(novosDados.modelo);
			expect(response.body.tipoVeiculo).toBe(novosDados.tipoVeiculo);
		});
	});

	describe("DELETE /api/veiculos/:id", () => {
		it("deve deletar veículo com sucesso", async () => {
			const veiculo = gerarVeiculo();
			const createResponse = await server.post("/api/veiculos").set("Authorization", `Bearer ${token}`).send(veiculo);

			const response = await server.delete(`/api/veiculos/${createResponse.body._id}`).set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("mensagem", "Veiculo removido com sucesso");

			const veiculoExiste = await Veiculo.findById(createResponse.body._id);
			expect(veiculoExiste).toBeNull();
		});
	});

	afterEach(async () => {
		await Veiculo.deleteMany({});
	});

	afterAll(async () => {
		await Usuario.deleteMany({});
	});
});
