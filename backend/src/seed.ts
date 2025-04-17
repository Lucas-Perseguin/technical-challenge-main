import Bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connectDb } from "./config/mongo.js";
import Usuario from "./models/Usuario.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const usuario = {
	nome: "Admin",
	email: "admin@email.com",
	cpf: "219.120.438-40".replace(/[^0-9]/g, ""),
	senha: Bcrypt.hashSync("admin", 12),
	admin: true,
};

const seed = async () => {
	try {
		connectDb();

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
