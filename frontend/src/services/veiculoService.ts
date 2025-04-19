import type { ResultadoPaginado } from "@customTypes/globalTypes";
import type { CriarVeiculoType, EditarVeiculoType, VeiculoType } from "@customTypes/veiculoTypes";
import api from "api";

async function listarVeiculos(query = "") {
	return await api.get<ResultadoPaginado<VeiculoType>>(`/veiculos?${query}`);
}

async function deletarVeiculo(id: string) {
	return await api.delete(`/veiculos/${id}`);
}

async function buscarVeiculo(id: string) {
	return await api.get<VeiculoType>(`/veiculos/${id}`);
}

async function editarVeiculo(data: EditarVeiculoType, id: string) {
	return await api.put<VeiculoType>(`/veiculos/${id}`, data);
}

async function cadastrarVeiculo(data: CriarVeiculoType) {
	return await api.post("/veiculos", data);
}

export const veiculoService = {
	listarVeiculos,
	deletarVeiculo,
	buscarVeiculo,
	editarVeiculo,
	cadastrarVeiculo,
};
