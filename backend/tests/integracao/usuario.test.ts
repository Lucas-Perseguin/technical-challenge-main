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
		cpf: "529.982.247-25",
		senha: faker.internet.password(),
		admin: false,
	});

	describe("POST /api/usuarios", () => {
		beforeEach(async () => await Usuario.deleteMany({}));
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

		it("deve retornar erro ao criar usuário com email inválido", async () => {
			const usuario = gerarUsuario();
			usuario.email = "emailinvalido";

			const response = await server.post("/api/usuarios").send(usuario);

			expect(response.status).toBe(400);
			expect(response.text).toContain("email");
		});

		it("deve retornar erro ao criar usuário com nome muito curto", async () => {
			const usuario = gerarUsuario();
			usuario.nome = "ab";

			const response = await server.post("/api/usuarios").send(usuario);

			expect(response.status).toBe(400);
			expect(response.text).toContain("nome");
		});

		it("deve retornar erro ao criar usuário com senha muito curta", async () => {
			const usuario = gerarUsuario();
			usuario.senha = "123";

			const response = await server.post("/api/usuarios").send(usuario);

			expect(response.status).toBe(400);
			expect(response.text).toContain("senha");
		});

		it("deve retornar erro ao criar usuário com CPF duplicado", async () => {
			const usuario = gerarUsuario();
			await server.post("/api/usuarios").send(usuario);

			const response = await server.post("/api/usuarios").send(usuario);

			expect(response.status).toBe(400);
			expect(response.body.erro).toContain("duplicate key");
		});
	});

	describe("POST /api/usuarios/login", () => {
		beforeEach(async () => await Usuario.deleteMany({}));

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

		it("deve retornar erro ao tentar login com CPF inválido", async () => {
			const response = await server.post("/api/usuarios/login").send({
				cpf: "123.456.789-00",
				senha: "senha123",
			});

			expect(response.status).toBe(400);
			expect(response.text).toContain("CPF");
		});

		it("deve retornar erro ao tentar login com senha muito curta", async () => {
			const response = await server.post("/api/usuarios/login").send({
				cpf: "529.982.247-25",
				senha: "123",
			});

			expect(response.status).toBe(400);
			expect(response.text).toContain("senha");
		});
	});

	describe("Rotas autenticadas", () => {
		let token: string;
		let usuarioId: string;
		let usuarioComumToken: string;

		beforeAll(async () => {
			const admin = gerarUsuario();
			admin.admin = true;

			const createResponse = await server.post("/api/usuarios").send(admin);
			usuarioId = createResponse.body._id;

			const loginResponse = await server.post("/api/usuarios/login").send({
				cpf: admin.cpf,
				senha: admin.senha,
			});
			token = loginResponse.body.token;

			const usuarioComum = { ...gerarUsuario(), cpf: "345.560.530-30" };
			const createComumResponse = await server.post("/api/usuarios").send(usuarioComum);
			const loginComumResponse = await server.post("/api/usuarios/login").send({
				cpf: usuarioComum.cpf,
				senha: usuarioComum.senha,
			});
			usuarioComumToken = loginComumResponse.body.token;
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

			it("deve retornar erro para usuário não admin", async () => {
				const response = await server.get("/api/usuarios").set("Authorization", `Bearer ${usuarioComumToken}`);

				expect(response.status).toBe(403);
				expect(response.body.erro).toBe("Permissão negada");
			});

			it("deve filtrar usuários por nome", async () => {
				const response = await server
					.get(`/api/usuarios?nome=${faker.person.firstName()}`)
					.set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(200);
				expect(response.body).toHaveProperty("dados");
				expect(response.body).toHaveProperty("paginacao");
			});

			it("deve paginar resultados corretamente", async () => {
				const response = await server.get("/api/usuarios?page=2&limit=10").set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(200);
				expect(response.body.dados.length).toBeLessThanOrEqual(10);
				expect(response.body.paginacao.paginasTotal).toBe(1);
			});
		});

		describe("GET /api/usuarios/:id", () => {
			it("deve buscar usuário por ID com sucesso", async () => {
				const response = await server.get(`/api/usuarios/${usuarioId}`).set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(200);
				expect(response.body._id).toBe(usuarioId);
			});

			it("deve retornar 404 para ID inexistente", async () => {
				const response = await server.get("/api/usuarios/64a7b7d77e71ee3e989f1234").set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(404);
				expect(response.body.erro).toBe("Usuário não encontrado");
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

			it("deve retornar erro ao tentar atualizar outro usuário sem ser admin", async () => {
				const novosDados = {
					nome: faker.person.fullName(),
					email: faker.internet.email(),
				};

				const response = await server
					.put(`/api/usuarios/${usuarioId}`)
					.set("Authorization", `Bearer ${usuarioComumToken}`)
					.send(novosDados);

				expect(response.status).toBe(403);
				expect(response.body.erro).toBe("Permissão negada");
			});

			it("deve retornar erro ao tentar atualizar admin sendo outro admin", async () => {
				const outroAdmin = { ...gerarUsuario(), cpf: "777.281.810-68", admin: true };
				const createResponse = await server.post("/api/usuarios").send(outroAdmin);

				const novosDados = {
					nome: faker.person.fullName(),
					email: faker.internet.email(),
				};

				const response = await server
					.put(`/api/usuarios/${createResponse.body._id}`)
					.set("Authorization", `Bearer ${token}`)
					.send(novosDados);

				expect(response.status).toBe(403);
				expect(response.body.erro).toBe("Permissão negada");
			});

			it("deve retornar erro ao atualizar com email inválido", async () => {
				const novosDados = {
					nome: faker.person.fullName(),
					email: "emailinvalido",
				};

				const response = await server.put(`/api/usuarios/${usuarioId}`).set("Authorization", `Bearer ${token}`).send(novosDados);

				expect(response.status).toBe(400);
			});
		});

		describe("DELETE /api/usuarios/:id", () => {
			it("deve deletar usuário com sucesso", async () => {
				const response = await server.delete(`/api/usuarios/${usuarioId}`).set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(200);

				const usuarioExiste = await Usuario.findById(usuarioId);
				expect(usuarioExiste).toBeNull();
			});

			it("deve retornar erro ao tentar deletar outro usuário sem ser admin", async () => {
				const response = await server.delete(`/api/usuarios/${usuarioId}`).set("Authorization", `Bearer ${usuarioComumToken}`);

				expect(response.status).toBe(403);
				expect(response.body.erro).toBe("Permissão negada");
			});

			it("deve retornar 404 para usuário inexistente", async () => {
				const response = await server.delete("/api/usuarios/64a7b7d77e71ee3e989f1234").set("Authorization", `Bearer ${token}`);

				expect(response.status).toBe(404);
				expect(response.body.erro).toBe("Usuário não encontrado");
			});
		});
	});

	afterAll(async () => {
		await Usuario.deleteMany({});
	});
});
