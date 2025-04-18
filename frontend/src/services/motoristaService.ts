import type { ResultadoPaginado } from "@customTypes/globalTypes";
import type { MotoristasType } from "@customTypes/motoristaTypes.js";
import api from "api";

async function listarMotoristas(query = "") {
	return (await api.get<ResultadoPaginado<MotoristasType>>(`/motoristas?${query}`)).data;
}

async function deletarMotorista(id: string) {
	return await api.delete(`/motoristas/${id}`);
}

export const motoristaService = {
	listarMotoristas,
	deletarMotorista,
};
