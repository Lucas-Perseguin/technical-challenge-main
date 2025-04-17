import type mongoose from "mongoose";

export type MotoristaType = {
	_id: mongoose.Schema.Types.ObjectId;
	nome: string;
	cpf: string;
	cnh: { numero: string; validade: Date };
	createdAt: mongoose.Schema.Types.Date;
	updatedAt: mongoose.Schema.Types.Date;
};

export type CriarMotoristaType = Omit<MotoristaType, "_id" | "createdAt" | "updatedAt">;

export type AtualizarMotoristaType = {
	nome: string;
	cnh: {
		validade: Date;
	};
};

export type ListarMotoristasType = {
	nome: string;
	cpf: string;
	cnh: {
		numero: string;
	};
	page: number;
	limit: number;
};
