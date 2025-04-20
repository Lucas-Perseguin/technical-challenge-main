import type { ResultadoPaginado } from "@customTypes/globalTypes";
import type { BuscarViagemType, EditarViagemType, ViagemType } from "@customTypes/viagemTypes";
import api from "api";

async function listarViagens(query = "") {
	return await api.get<ResultadoPaginado<ViagemType>>(`/viagens?${query}`);
}

async function deletarViagem(id: string) {
	return await api.delete(`/viagens/${id}`);
}

async function buscarViagem(id: string) {
	return await api.get<BuscarViagemType>(`/viagens/${id}`);
}

async function editarViagem(data: EditarViagemType, id: string) {
	return await api.put<ViagemType>(`/viagens/${id}`, data);
}

async function cadastrarViagem(data: EditarViagemType) {
	return await api.post("/viagens", data);
}

async function buscarViagensDoMotorista(id: string, query = "") {
	return await api.get<ResultadoPaginado<ViagemType>>(`/viagens/motorista/${id}?${query}`);
}

async function buscarViagensDoVeiculo(id: string, query = "") {
	return await api.get<ResultadoPaginado<ViagemType>>(`/viagens/veiculo/${id}?${query}`);
}

export const viagemService = {
	listarViagens,
	deletarViagem,
	buscarViagem,
	editarViagem,
	cadastrarViagem,
	buscarViagensDoMotorista,
	buscarViagensDoVeiculo,
};
