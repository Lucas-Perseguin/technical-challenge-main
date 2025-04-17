import mongoose from "mongoose";
import type { ViagemType } from "../types/viagemTypes.js";

const viagemSchema = new mongoose.Schema<ViagemType>(
	{
		origem: {
			type: String,
			required: true,
		},
		destino: {
			type: String,
			required: true,
		},
		dataPartida: {
			type: Date,
			required: true,
		},
		previsaoChegada: {
			type: Date,
			required: true,
		},
		motorista: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Motorista",
			required: true,
		},
		veiculo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Veiculo",
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["Planejada", "Em andamento", "Concluída", "Cancelada"],
		},
	},
	{ timestamps: true },
);

const Viagem = mongoose.model<ViagemType>("Viagem", viagemSchema);
export default Viagem;
