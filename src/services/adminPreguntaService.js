import api from "./api";

// Recupera todas las preguntas del test desde el area admin.
// withCredentials permite enviar la cookie de sesion admin al backend.
export async function getAdminQuestions() {
    const response = await api.get("/admin/preguntas", {
        withCredentials: true
    });

    return response.data.datos;
}

export async function getAdminQuestionsSummary() {
    const response = await api.get("/admin/preguntas/resumen", {
        withCredentials: true
    });

    return response.data.datos;
}

// Actualiza una pregunta existente con sus opciones asociadas desde el area admin.
export async function updateAdminQuestion(idPregunta, datosRecibidos) {
    const response = await api.put(`/admin/preguntas/${idPregunta}`, datosRecibidos, {
        withCredentials: true
    });

    return response.data.datos;
}
