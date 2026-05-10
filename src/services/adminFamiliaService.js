import api from "./api";
//CRUD básico, Recupera todas las familias profesionales del area admin
//withCredentials permite enviar la cookie de sesion admin al backend.

export async function getAdminFamilies(){
    const response = await api.get("/admin/familias", { 
        withCredentials: true,
    });

    return response.data.datos;
}

// Crea una nueva familia profesional desde el area admin.
export async function createAdminFamily(datosRecibidos) {
	const response = await api.post("/admin/familias", datosRecibidos, {
		withCredentials: true,
	});

	return response.data.datos;
}

// Actualiza una familia profesional existente desde el area admin.
export async function updateAdminFamily(idFamilia, datosRecibidos) {
	const response = await api.put(
		`/admin/familias/${idFamilia}`,
		datosRecibidos,
		{
			withCredentials: true,
		},
	);

	return response.data.datos;
}