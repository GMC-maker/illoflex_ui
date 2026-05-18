import api from "./api";
import { buildAdminAuthConfig } from "./adminAuthService";

export async function getAdminQuestions() {
    const response = await api.get("/admin/preguntas", buildAdminAuthConfig());

    return response.data.datos;
}

export async function getAdminQuestionsSummary() {
    const response = await api.get(
        "/admin/preguntas/resumen",
        buildAdminAuthConfig(),
    );

    return response.data.datos;
}

export async function updateAdminPreguntaStatus(idPregunta, activa) {
    const response = await api.patch(
        `/admin/preguntas/${idPregunta}`,
        { activa },
        buildAdminAuthConfig(),
    );

    return response.data.datos;
}

// Actualiza una pregunta existente con sus opciones asociadas desde el area admin.
export async function updateAdminQuestion(idPregunta, datosRecibidos) {
    const response = await api.put(
        `/admin/preguntas/${idPregunta}`,
        datosRecibidos,
        buildAdminAuthConfig(),
    );

    return response.data.datos;
}
