import mongoose from "mongoose";

export type VeiculoType = {
	_id: mongoose.Schema.Types.ObjectId;
	modelo: string;
	placa: string;
	tipoVeiculo: "Caminhão" | "Van" | "Carro" | "Caminhonete";
	tipoCapacidade: "Kilogramas" | "Litros";
	capacidade: number;
	createdAt: mongoose.Schema.Types.Date;
	updatedAt: mongoose.Schema.Types.Date;
};

const VeiculoSchema = new mongoose.Schema<VeiculoType>(
	{
		modelo: {
			type: String,
			required: true,
		},
		placa: {
			type: String,
			unique: true,
			required: true,
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
