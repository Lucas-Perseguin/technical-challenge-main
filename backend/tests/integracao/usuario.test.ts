import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app.js";
import Usuario from "../../src/models/Usuario.js";
import type { CriarUsuarioType } from "../../src/types/usuarioTypes.js";

const server = supertest(app);

describe("Testes de integração - Usuários", () => {
	const gerarUsuario = (): CriarUsuarioType => ({
		nome: faker.person.fullName(),
		email: faker.internet.email(),
		cpf: "529.982.247-25", // Valid CPF for testing
		senha: faker.internet.password(),
		admin: false,
	});

	describe("POST /api/usuarios", () => {
		it("deve criar um novo usuário", async () => {
			const usuario = gerarUsuario();
			const response = await server.post("/api/usuarios").send(usuario);
			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("_id");
			expect(response.body.nome).toBe(usuario.nome);
			expect(response.body.email).toBe(usuario.email);
			expect(response.body).not.toHaveProperty("senha");
		});

		it("deve retornar erro ao criar usuário com CPF inválido", async () => {
			const usuario = gerarUsuario();
			usuario.cpf = "123.456.789-00";
			const response = await server.post("/api/usuarios").send(usuario);

			expect(response.status).toBe(400);
		});
	});

	describe("POST /api/usuarios/login", () => {
		it("deve fazer login com sucesso", async () => {
			const usuario = gerarUsuario();
			await server.post("/api/usuarios").send(usuario);

			const response = await server.post("/api/usuarios/login").send({
				cpf: usuario.cpf,
				senha: usuario.senha,
			});

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("token");
		});

		it("deve retornar erro com credenciais inválidas", async () => {
			const response = await server.post("/api/usuarios/login").send({
				cpf: "529.982.247-25",
				senha: "senhaerrada",
			});

			expect(response.status).toBe(404);
		});
	});

	describe("Rotas autenticadas", () => {
		let token: string;
		let usuarioId: string;

		beforeEach(async () => {
			const usuario = gerarUsuario();
			usuario.admin = true;

			const createResponse = await server.post("/api/usuarios").send(usuario);
			usuarioId = createResponse.body._id;

			const loginResponse = await server.post("/api/usuarios/login").send({
				cpf: usuario.cpf,
				senha: usuario.senha,
			});
			token = loginResponse.body.token;
		});

		describe("GET /api/usuarios", () => {
			it("deve listar usuários com sucesso", async () => {
				const response = await server.get("/api/usuarios").set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty("dados");
				expect(response.body).toHaveProperty("paginacao");
			});

			it("deve retornar erro sem token", async () => {
				const response = await server.get("/api/usuarios");
				expect(response.status).toBe(400);
			});
		});

		describe("GET /api/usuarios/token", () => {
			it("deve retornar usuário do token", async () => {
				const response = await server.get("/api/usuarios/token").set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty("_id");
				expect(response.body).toHaveProperty("nome");
			});
		});

		describe("PUT /api/usuarios/:id", () => {
			it("deve atualizar usuário com sucesso", async () => {
				const novosDados = {
					nome: faker.person.fullName(),
					email: faker.internet.email(),
				};

				const response = await server.put(`/api/usuarios/${usuarioId}`).set("Authorization", `Bearer ${token}`).send(novosDados);

				expect(response.status).toBe(200);
				expect(response.body.nome).toBe(novosDados.nome);
				expect(response.body.email).toBe(novosDados.email);
			});
		});

		describe("DELETE /api/usuarios/:id", () => {
			it("deve deletar usuário com sucesso", async () => {
				const response = await server.delete(`/api/usuarios/${usuarioId}`).set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(200);

				const usuarioExiste = await Usuario.findById(usuarioId);
				expect(usuarioExiste).toBeNull();
			});
		});
	});

	afterEach(async () => {
		await Usuario.deleteMany({});
	});
});
