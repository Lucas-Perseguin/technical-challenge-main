import "dotenv/config";
import Bcrypt from "bcrypt";
import { connectDb } from "./config/mongo.js";
import Motorista from "./models/Motorista.js";
import Usuario from "./models/Usuario.js";

const motoristas = [
	{
		nome: "João Silva",
		cpf: "919.708.988-52".replace(/[^0-9]/g, ""),
		cnh: {
			numero: "68405447700",
			validade: new Date("2026-12-01"),
		},
	},
	{
		nome: "Maria Oliveira",
		cpf: "316.017.798-01".replace(/[^0-9]/g, ""),
		cnh: {
			numero: "57319582121",
			validade: new Date("2025-10-15"),
		},
	},
	{
		nome: "Carlos Mendes",
		cpf: "657.434.818-81".replace(/[^0-9]/g, ""),
		cnh: {
			numero: "65927717074",
			validade: new Date("2027-04-30"),
		},
	},
];

const usuario = {
	nome: "Admin",
	email: "admin@email.com",
	cpf: "219.120.438-40".replace(/[^0-9]/g, ""),
	senha: Bcrypt.hashSync("admin", 12),
};

const seed = async () => {
	try {
		connectDb();

		await Motorista.deleteMany();
		console.log("Coleção Motoristas limpa");
		const motoristasCriados = await Motorista.insertMany(motoristas);
		console.log(`${motoristasCriados.length} motoristas inseridos`);

		await Usuario.deleteMany();
		console.log("Coleção Usuários limpa");
		const usuarioCriado = await Usuario.create(usuario);
		console.log("Usuário admin criado com sucesso", usuarioCriado);

		process.exit(0);
	} catch (error) {
		console.error("Erro ao fazer seed:", error);
		process.exit(1);
	}
};

seed();
