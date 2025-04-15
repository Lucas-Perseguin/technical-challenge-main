import mongoose from "mongoose";

enum Status {
	Planejada,
	Andamento,
	Concluida,
	Cancelada,
}

export type Viagemtype = {
	_id: mongoose.Schema.Types.ObjectId;
	origem: string;
	destino: string;
	dataPartida: Date;
	previsaoChegada: Date;
	motorista: mongoose.Schema.Types.ObjectId;
	veiculo: mongoose.Schema.Types.ObjectId;
	status: Status;
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
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
);

const Viagem = mongoose.model<Viagemtype>("Viagem", viagemSchema);
export default Viagem;
