import api from "./api";
import { buildAdminAuthConfig } from "./adminAuthService";

// Recupera todos los ciclos formativos del area admin.
// withCredentials permite enviar la cookie de sesion admin al backend.
export async function getAdminCiclos() {
	const response = await api.get("/admin/ciclos", buildAdminAuthConfig());

	return response.data.datos;
}

// Crea un nuevo ciclo formativo desde el area admin.
export async function createAdminCiclo(datosRecibidos) {
	const response = await api.post(
		"/admin/ciclos",
		datosRecibidos,
		buildAdminAuthConfig(),
	);

	return response.data.datos;
}

// Actualiza un ciclo formativo existente desde el area admin.
export async function updateAdminCiclo(idCiclo, datosRecibidos) {
	const response = await api.put(
		`/admin/ciclos/${idCiclo}`,
		datosRecibidos,
		buildAdminAuthConfig(),
	);
	return response.data.datos;
}

export async function deleteAdminCiclo(idCiclo) {
	const response = await api.delete(
		`/admin/ciclos/${idCiclo}`,
		buildAdminAuthConfig(),
	);

	return response.data.datos;
}
