import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
	(config) => {
		config.headers.setAuthorization(`Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`);
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default api;
