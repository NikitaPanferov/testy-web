import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = `https://nikitapanferov-testy-api-3c3f.twc1.net/`;

const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
	return config;
});

$api.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response.status == 401 &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true;
			try {
				const response = await axios.get<AuthResponse>(
					`${API_URL}auth/refresh`,
					{
						withCredentials: true,
					}
				);
				localStorage.setItem("token", response.data.access_token);
				return $api.request(originalRequest);
			} catch (e) {
				console.error("Interception error:", e);
			}
		}
		throw error;
	}
);

export default $api;
