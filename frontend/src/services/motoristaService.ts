import type { ResultadoPaginado } from "@customTypes/globalTypes";
import type { EditarMotoristaType, MotoristasType } from "@customTypes/motoristaTypes";
import api from "api";

async function listarMotoristas(query = "") {
	return await api.get<ResultadoPaginado<MotoristasType>>(`/motoristas?${query}`);
}

async function deletarMotorista(id: string) {
	return await api.delete(`/motoristas/${id}`);
}

async function buscarMotorista(id: string) {
	return await api.get<MotoristasType>(`/motoristas/${id}`);
}

async function editarMotorista(data: EditarMotoristaType, id: string) {
	return await api.put<MotoristasType>(`/motoristas/${id}`, data);
}

async function cadastrarMotorista(data: Omit<MotoristasType, "_id" | "createdAt" | "updatedAt">) {
	return await api.post("/motoristas", data);
}

export const motoristaService = {
	listarMotoristas,
	deletarMotorista,
	buscarMotorista,
	editarMotorista,
	cadastrarMotorista,
};
