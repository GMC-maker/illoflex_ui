import api from "./api";

const ADMIN_TOKEN_KEY = "admin_token";

const getStoredAdminToken = () => {
	return sessionStorage.getItem(ADMIN_TOKEN_KEY);
};

export const buildAdminAuthConfig = () => {
	const token = getStoredAdminToken();

	if (!token) {
		return {
			withCredentials: true,
		};
	}

	return {
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

// Inicia sesion en el area admin enviando email y password.
// withCredentials permite que el navegador guarde la cookie enviada por el backend.
export async function loginAdmin(credentials) {
	const response = await api.post("/admin/login", credentials, {
		withCredentials: true,
	});

	const loginData = response.data.datos;

	if (loginData?.token) {
		sessionStorage.setItem(ADMIN_TOKEN_KEY, loginData.token);
	} else {
		sessionStorage.removeItem(ADMIN_TOKEN_KEY);
	}

	return loginData;
}

// Recupera el admin autenticado usando Bearer y manteniendo cookie como compatibilidad.
export async function getCurrentAdmin() {
	const response = await api.get("/admin/me", buildAdminAuthConfig());

	return response.data.datos;
}

// Cierra la sesion admin eliminando la cookie del backend y el token local.
export async function logoutAdmin() {
	const response = await api.post(
		"/admin/logout",
		{},
		buildAdminAuthConfig(),
	);

	sessionStorage.removeItem(ADMIN_TOKEN_KEY);

	return response.data;
}
