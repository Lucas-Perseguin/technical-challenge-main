import mongoose from "mongoose";
import { validateCPF } from "validations-br";
import type { UsuarioType } from "../types/usuarioTypes.js";

const UsuarioSchema = new mongoose.Schema<UsuarioType>(
	{
		nome: {
			type: String,
			required: true,
			minlength: 3,
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
			minlength: 4,
		},
		admin: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true },
);

const Usuario = mongoose.model<UsuarioType>("Usuario", UsuarioSchema);
export default Usuario;
