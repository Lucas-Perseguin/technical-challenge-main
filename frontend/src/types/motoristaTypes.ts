export type MotoristasType = {
	_id: string;
	nome: string;
	cpf: string;
	cnh: { numero: string; validade: string };
	createdAt: Date;
	updatedAt: Date;
};

export type ListarMotoristasFiltrosType = {
	nome?: string;
	cpf?: string;
	cnh?: { numero?: string };
	page?: number;
	limit?: number;
};

export type EditarMotoristaType = {
	nome: string;
	cnh: {
		validade: string;
	};
};
