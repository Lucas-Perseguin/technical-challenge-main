import type { MotoristasType } from "./motoristaTypes";
import type { VeiculoType } from "./veiculoTypes";

export type ViagemType = {
	_id: string;
	origem: string;
	destino: string;
	dataPartida: Date;
	previsaoChegada: Date;
	motorista?: string;
	veiculo?: string;
	status: "Planejada" | "Em andamento" | "Concluída" | "Cancelada";
	createdAt: Date;
	updatedAt: Date;
	motoristaInfo: MotoristasType;
	veiculoInfo: VeiculoType;
};

export type CriarViagemType = Omit<ViagemType, "_id" | "createdAt" | "updatedAt">;

export type EditarViagemType = Omit<CriarViagemType, "motoristaInfo" | "veiculoInfo">;

export type BuscarViagemType = Omit<CriarViagemType, "dataPartida" | "previsaoChegada" | "motorista" | "veiculo"> & {
	dataPartida: string;
	previsaoChegada: string;
	motorista: MotoristasType;
	veiculo: VeiculoType;
};

export type VisualizarViagemType = Omit<EditarViagemType, "dataPartida" | "previsaoChegada"> & {
	dataPartida: string;
	previsaoChegada: string;
};

export type ListarViagensFiltrosType = Omit<CriarViagemType, "veiculo" | "motorista" | "dataPartida" | "previsaoChegada"> & {
	page: number;
	limit: number;
	motorista?: string;
	placa?: string;
};
