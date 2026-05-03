import api from "./api";

export async function createAnonymousTest() {
	const response = await api.post("/tests");
	return response.data.datos;
}

export async function getTestQuestions(uuid) {
	const response = await api.get(`/tests/${uuid}/preguntas`);
	return response.data.datos;
}

export async function getTestResponses(uuid) {
	const response = await api.get(`/tests/${uuid}/respuestas`);
	return response.data.datos;
}

export async function createTestResponse(uuid, payload) {
	const response = await api.post(`/tests/${uuid}/respuestas`, payload);
	return response.data.datos;
}

export async function updateTestResponse(uuid, responseId, payload) {
	const response = await api.put(`/tests/${uuid}/respuestas/${responseId}`, payload);
	return response.data.datos;
}

export async function finalizeTest(uuid) {
	const response = await api.post(`/tests/${uuid}/finalizar`);
	return response.data.datos;
}

export async function getTestResult(uuid) {
	const response = await api.get(`/tests/${uuid}/resultado`);
	return response.data.datos;
}

export async function createResultLink(uuid, email) {
	const response = await api.post(`/resultados/${uuid}/enlace`, { email });
	return response.data.datos;
}

export async function getResultByToken(token) {
	const response = await api.get(`/enlaces/${token}`);
	return response.data.datos;
}