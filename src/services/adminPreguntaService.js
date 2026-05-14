import api from "./api";

// Recupera todas las preguntas del test desde el area admin.
// withCredentials permite enviar la cookie de sesion admin al backend.
export async function getAdminQuestions() {
    const response = await api.get("/admin/preguntas", {
        withCredentials: true
    });

    return response.data.datos;
}
