import type mongoose from "mongoose";

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

export type CriarVeiculoType = Omit<VeiculoType, "_id" | "createdAt" | "updatedAt">;

export type AtualizarVeiculoType = Omit<CriarVeiculoType, "placa">;

export type ListarVeiculosType = Omit<CriarVeiculoType, "capacidade" | "tipoCapacidade"> & { page: number; limit: number };
