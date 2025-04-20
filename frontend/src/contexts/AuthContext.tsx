import api from "api";
import { type ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
	token: string | null;
	setToken: React.Dispatch<React.SetStateAction<string | null>>;
	login: (token: string, remember: boolean) => void;
	logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

interface AuthContextProviderType {
	children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderType) {
	const navigate = useNavigate();

	const [token, setToken] = useState(localStorage.getItem("token") || sessionStorage.getItem("token"));

	useEffect(() => {
		if (token) {
			api.interceptors.request.use(
				(config) => {
					config.headers.setAuthorization(`Bearer ${token}`);
					return config;
				},
				(error) => {
					return Promise.reject(error);
				},
			);
		}
	}, [token]);

	function login(token: string, remember: boolean) {
		if (remember) {
			localStorage.setItem("token", token);
		} else {
			sessionStorage.setItem("token", token);
		}
		setToken(token);
		navigate("/");
	}

	function logout() {
		localStorage.removeItem("token");
		sessionStorage.removeItem("token");
		setToken(null);
		navigate("/acessar");
	}

	return (
		<AuthContext.Provider
			value={{
				token,
				setToken,
				logout,
				login,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
