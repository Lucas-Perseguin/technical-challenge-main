import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app.js";
import Usuario from "../../src/models/Usuario.js";
import type { CriarUsuarioType } from "../../src/types/usuarioTypes.js";

const server = supertest(app);

describe("Testes de integração - Autenticação", () => {
	const gerarUsuario = (): CriarUsuarioType => ({
		nome: faker.person.fullName(),
		email: faker.internet.email(),
		cpf: "529.982.247-25",
		senha: faker.internet.password(),
		admin: true,
	});

	describe("Middleware de Autenticação", () => {
		let token: string;

		beforeAll(async () => {
			await Usuario.deleteMany({});
			const usuario = gerarUsuario();

			await server.post("/api/usuarios").send(usuario);
			const loginResponse = await server.post("/api/usuarios/login").send({ cpf: usuario.cpf, senha: usuario.senha });

			token = loginResponse.body.token;
		});

		it("deve permitir acesso com token válido", async () => {
			const response = await server.get("/api/usuarios").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
		});

		it("deve rejeitar requisição sem header de autorização", async () => {
			const response = await server.get("/api/usuarios");

			expect(response.status).toBe(400);
			expect(response.body.erro).toBe("Token incorreto");
		});

		it("deve rejeitar header de autorização vazio", async () => {
			const response = await server.get("/api/usuarios").set("Authorization", "");

			expect(response.status).toBe(400);
			expect(response.body.erro).toBe("Token incorreto");
		});

		it("deve rejeitar token mal formatado", async () => {
			const response = await server.get("/api/usuarios").set("Authorization", "Bearer");

			expect(response.status).toBe(400);
			expect(response.body.erro).toBe("Token incorreto");
		});

		it("deve rejeitar token inválido", async () => {
			const response = await server.get("/api/usuarios").set("Authorization", "Bearer invalid.token.here");

			expect(response.status).toBe(401);
			expect(response.body.erro).toBe("Acesso negado");
		});

		it("deve rejeitar token sem payload _id", async () => {
			// Create token without _id in payload
			const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZX0.hK2NrBqMxmO9QS7JLV2Cnh9UXQ6qVgWl7Hs2p0LDNso";

			const response = await server.get("/api/usuarios").set("Authorization", `Bearer ${invalidToken}`);

			expect(response.status).toBe(401);
			expect(response.body.erro).toBe("Acesso negado");
		});

		it("deve verificar se token mantém dados do usuário na requisição", async () => {
			const response = await server.get("/api/usuarios/token").set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("_id");
			expect(response.body).toHaveProperty("nome");
			expect(response.body).toHaveProperty("email");
			expect(response.body).toHaveProperty("cpf");
		});

		it("deve verificar permissões de admin", async () => {
			// Create non-admin user
			const regularUser = { ...gerarUsuario(), admin: false, cpf: "345.560.530-30" };

			await server.post("/api/usuarios").send(regularUser);
			const loginResponse = await server.post("/api/usuarios/login").send({ cpf: regularUser.cpf, senha: regularUser.senha });

			const regularToken = loginResponse.body.token;

			const response = await server.get("/api/usuarios").set("Authorization", `Bearer ${regularToken}`);

			expect(response.status).toBe(403);
			expect(JSON.parse(response.text).erro).toBe("Permissão negada");
		});
	});

	afterAll(async () => {
		await Usuario.deleteMany({});
	});
});
