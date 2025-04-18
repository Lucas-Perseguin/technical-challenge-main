export type ResultadoPaginado<T> = {
	dados: T[];
} & { paginacao: Omit<PaginacaoType, "page" | "limit"> };

export type PaginacaoType = {
	paginasTotal: number;
	itensTotal: number;
	page: number;
	limit: number;
};
