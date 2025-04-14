import "dotenv/config";
import Bcrypt from "bcrypt";
import { connectDb } from "./config/mongo.js";
import Motorista from "./models/Motorista.js";
import Usuario from "./models/Usuario.js";

const motoristas = [
	{
		nome: "João Silva",
		cpf: "11122233344",
		cnh: {
			numero: "CNH001",
			validade: new Date("2026-12-01"),
		},
	},
	{
		nome: "Maria Oliveira",
		cpf: "55566677788",
		cnh: {
			numero: "CNH002",
			validade: new Date("2025-10-15"),
		},
	},
	{
		nome: "Carlos Mendes",
		cpf: "99988877766",
		cnh: {
			numero: "CNH003",
			validade: new Date("2027-04-30"),
		},
	},
];

const usuario = {
	nome: "Admin",
	email: "admin@email.com",
	cpf: "219.120.438-40",
	senha: "admin",
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
		const senhaHash = Bcrypt.hashSync(usuario.senha, 12);
		const usuarioCriado = await Usuario.create({
			...usuario,
			senha: senhaHash,
		});
		console.log("Usuário admin criado com sucesso", usuarioCriado);

		process.exit(0);
	} catch (error) {
		console.error("Erro ao fazer seed:", error);
		process.exit(1);
	}
};

seed();
