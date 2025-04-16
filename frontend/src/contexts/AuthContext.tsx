import { type ReactNode, createContext, useState } from "react";

interface AuthContextType {
	token: string | null;
	setToken: React.Dispatch<React.SetStateAction<string | null>>;
	login: (token: string) => void;
	logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

interface AuthContextProviderType {
	children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderType) {
	const [token, setToken] = useState(localStorage.getItem("token"));

	function login(token: string) {
		localStorage.setItem("token", token);
		setToken(token);
	}

	function logout() {
		localStorage.removeItem("token");
		setToken(null);
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
