import mongoose from "mongoose";

export const connectDb = () => {
	if (!process.env.MONGO_URI) throw new Error("MONGO_URI não está definido!");
	mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			console.log("MongoDB conectado!");
		})
		.catch((err) => {
			console.error("Erro ao conectar no MongoDB:", err);
		});
};
