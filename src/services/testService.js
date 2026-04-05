import api from "./api";

export async function createAnonymousTest() {
	const response = await api.post("/tests");
	return response.data.datos;
}
