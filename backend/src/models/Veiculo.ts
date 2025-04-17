import mongoose from "mongoose";
import type { VeiculoType } from "../types/veiculoTypes.js";

const VeiculoSchema = new mongoose.Schema<VeiculoType>(
	{
		modelo: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 60,
		},
		placa: {
			type: String,
			unique: true,
			required: true,
			minlength: 6,
			maxlength: 12,
		},
		tipoVeiculo: {
			type: String,
			required: true,
			enum: ["Caminhão", "Van", "Carro", "Caminhonete"],
		},
		tipoCapacidade: {
			type: String,
			required: true,
			enum: ["Kilogramas", "Litros"],
		},
		capacidade: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
);

const Veiculo = mongoose.model<VeiculoType>("Veiculo", VeiculoSchema);
export default Veiculo;
