import mongoose from "mongoose";
import { validateCNH, validateCPF } from "validations-br";
import type { MotoristaType } from "../types/motoristaTypes.js";

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
					validator: (value: string) => validateCNH(value),
					message: "CNH de formato inválido",
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
