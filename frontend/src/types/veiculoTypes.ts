export type VeiculoType = {
	_id: string;
	modelo: string;
	placa: string;
	tipoVeiculo: "Caminhão" | "Van" | "Carro" | "Caminhonete";
	tipoCapacidade: "Kilogramas" | "Litros";
	capacidade: number;
	createdAt: Date;
	updatedAt: Date;
};

export type CriarVeiculoType = Omit<VeiculoType, "_id" | "createdAt" | "updatedAt">;

export type EditarVeiculoType = Omit<CriarVeiculoType, "placa">;

export type ListarVeiculosFiltrosType = Partial<Omit<CriarVeiculoType, "capacidade" | "tipoCapacidade">> & {
	page?: number;
	limit?: number;
};
