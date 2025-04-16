import moment from "moment";
import mongoose from "mongoose";
import { validateCNH, validateCPF } from "validations-br";

export type MotoristaType = {
	_id: mongoose.Schema.Types.ObjectId;
	nome: string;
	cpf: string;
	cnh: { numero: string; validade: Date };
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
			validate: {
				validator: (value: string) => validateCPF(value),
				message: "CPF de formato inválido",
			},
		},
		cnh: {
			numero: {
				type: String,
				required: true,
				unique: true,
				validate: {
					validator: (value: string) =>
						validateCNH(value) && moment(value).isSameOrAfter(moment.now()),
					message: "CNH de formato inválido ou vencida",
				},
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
