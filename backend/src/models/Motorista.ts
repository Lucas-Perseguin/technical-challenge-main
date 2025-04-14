import mongoose from "mongoose";

export type MotoristaType = {
	_id: mongoose.Schema.Types.ObjectId;
	nome: string;
	cpf: string;
	cnh: { numero: string; valdiade: Date };
	createdAt: mongoose.Schema.Types.Date;
	updatedAt: mongoose.Schema.Types.Date;
};

const MotoristaSchema = new mongoose.Schema<MotoristaType>(
	{
		nome: {
			type: String,
			required: true,
		},
		cpf: {
			type: String,
			required: true,
			unique: true,
			match: /^\d{11}$/,
		},
		cnh: {
			numero: {
				type: String,
				required: true,
				unique: true,
			},
			validade: {
				type: Date,
				required: true,
			},
		},
	},
	{ timestamps: true },
);

const Motorista = mongoose.model<MotoristaType>("Motorista", MotoristaSchema);
export default Motorista;
