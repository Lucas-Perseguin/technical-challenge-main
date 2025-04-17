import type { LoginInputs } from "@pages/Login";
import type { RegisterInputs } from "@pages/Register";
import api from "api";

type UserLogin = Omit<LoginInputs, "remember">;

async function login(data: UserLogin) {
	return (await api.post("/usuarios/login", data)).data;
}

type UserRegister = Omit<RegisterInputs, "remember">;

async function register(data: UserRegister) {
	return (await api.post("/usuarios", { ...data, admin: false })).data;
}

export const userService = {
	login,
	register,
};
