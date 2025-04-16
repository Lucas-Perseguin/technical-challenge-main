import mongoose from "mongoose";

export type Viagemtype = {
	_id: mongoose.Schema.Types.ObjectId;
	origem: string;
	destino: string;
	dataPartida: Date;
	previsaoChegada: Date;
	motorista: mongoose.Schema.Types.ObjectId;
	veiculo: mongoose.Schema.Types.ObjectId;
	status: "Planejada" | "Em andamento" | "Concluída" | "Cancelada";
	createdAt: Date;
	updatedAt: Date;
};

const viagemSchema = new mongoose.Schema<Viagemtype>(
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

const Viagem = mongoose.model<Viagemtype>("Viagem", viagemSchema);
export default Viagem;
