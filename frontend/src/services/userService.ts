import type { LoginInputs } from "@pages/usuarios/Login";
import type { RegisterInputs } from "@pages/usuarios/Register";
import api from "api";

type UserLogin = Omit<LoginInputs, "remember">;

async function login(data: UserLogin) {
	return (await api.post("/usuarios/login", data)).data;
}

type UserRegister = Omit<RegisterInputs, "remember">;

async function register(data: UserRegister) {
	return (await api.post("/usuarios", { ...data, admin: false })).data;
}

async function buscarPorToken() {
	return await api.get("/usuarios/token");
}

async function editarUsusario(data: { nome: string; email: string }, id: string) {
	return await api.put(`/usuarios/${id}`, data);
}

async function deletarUsuario(id: string) {
	return await api.delete(`/usuarios/${id}`);
}

export const userService = {
	login,
	register,
	buscarPorToken,
	editarUsusario,
	deletarUsuario,
};
