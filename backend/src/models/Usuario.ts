import mongoose from "mongoose";
import { validateCPF } from "validations-br";

export type UsuarioType = {
	_id: mongoose.Schema.Types.ObjectId;
	nome: string;
	email: string;
	cpf: string;
	senha: string;
	createdAt: mongoose.Schema.Types.Date;
	updatedAt: mongoose.Schema.Types.Date;
};

const UsuarioSchema = new mongoose.Schema<UsuarioType>(
	{
		nome: {
			type: String,
			required: true,
			minlength: 4,
			maxlength: 60,
		},
		email: {
			type: String,
			required: true,
			match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email de formato inválido"],
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
		senha: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const Usuario = mongoose.model<UsuarioType>("Usuario", UsuarioSchema);
export default Usuario;
