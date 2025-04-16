import mongoose from "mongoose";

export async function connectDb() {
	if (!process.env.MONGO_URI) throw new Error("MONGO_URI não está definido!");
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB conectado!");
	} catch (err) {
		console.error("Erro ao conectar no MongoDB:", err);
	}
}
