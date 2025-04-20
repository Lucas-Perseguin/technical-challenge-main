import type mongoose from "mongoose";

export type ViagemType = {
	_id: mongoose.Schema.Types.ObjectId;
	origem: string;
	destino: string;
	dataPartida: Date;
	previsaoChegada: Date;
	motorista: mongoose.Schema.Types.ObjectId;
	veiculo: mongoose.Schema.Types.ObjectId;
	status: "Planejada" | "Em andamento" | "Concluída" | "Cancelada";
	createdAt: mongoose.Schema.Types.Date;
	updatedAt: mongoose.Schema.Types.Date;
};

export type CriarViagemType = Omit<ViagemType, "_id" | "createdAt" | "updatedAt">;

export type AtualizarViagemType = CriarViagemType;

export type ListarViagensType = Omit<CriarViagemType, "veiculo" | "motorista" | "dataPartida" | "previsaoChegada"> & {
	page: number;
	limit: number;
	motorista: string;
	placa: string;
};
