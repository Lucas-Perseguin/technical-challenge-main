import type mongoose from "mongoose";

export type UsuarioType = {
	_id: mongoose.Schema.Types.ObjectId;
	nome: string;
	email: string;
	cpf: string;
	senha: string;
	admin: boolean;
	createdAt: mongoose.Schema.Types.Date;
	updatedAt: mongoose.Schema.Types.Date;
};

export type CriarUsuarioType = Omit<UsuarioType, "_id" | "createdAt" | "updatedAt" | "admin">;

export type LogarUsuarioType = Pick<CriarUsuarioType, "cpf" | "senha">;

export type AtualizarUsuarioType = Pick<CriarUsuarioType, "nome" | "email">;

export type ListarUsuariosType = Pick<UsuarioType, "nome" | "email" | "cpf"> & { page: number; limit: number };
