import api from "./api";

// Inicia sesion en el area admin enviando email y password.
// withCredentials permite que el navegador guarde la cookie enviada por el backend.
export async function loginAdmin(credentials) {
	const response = await api.post("/admin/login", credentials, {
		withCredentials: true,
	});

	return response.data.datos;
}

// Recupera el admin autenticado actual usando la cookie ya guardada.
export async function getCurrentAdmin() {
	const response = await api.get("/admin/me", {
		withCredentials: true,
	});

	return response.data.datos;
}

// Cierra la sesion admin eliminando la cookie desde el backend.
export async function logoutAdmin() {
	const response = await api.post(
		"/admin/logout",
		{},
		{
			withCredentials: true,
		},
	);

	return response.data;
}
