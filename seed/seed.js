import Bcrypt from "bcrypt";
import mongoose from "mongoose";

const usuario = {
	nome: process.env.ADMIN_NOME,
	email: process.env.ADMIN_EMAIL,
	cpf: process.env.ADMIN_CPF.replace(/[^0-9]/g, ""),
	senha: Bcrypt.hashSync(process.env.ADMIN_SENHA, 12),
};

const UsuarioSchema = new mongoose.Schema(
	{
		nome: String,
		email: String,
		cpf: String,
		senha: String,
	},
	{ timestamps: true },
);

const Usuario = mongoose.model("Usuario", UsuarioSchema);

async function connectDb() {
	if (!process.env.MONGO_URI) throw new Error("MONGO_URI não está definido!");
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB conectado!");
	} catch (err) {
		console.error("Erro ao conectar no MongoDB:", err);
	}
}

const seed = async () => {
	try {
		await connectDb();

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
