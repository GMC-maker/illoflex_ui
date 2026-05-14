import { useCallback, useEffect, useState } from "react";
import { Alert, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { getAdminQuestions } from "../../services/adminPreguntaService";

function AdminPreguntasPanel() {
    const [preguntas, setPreguntas] = useState([]);
    const [isLoadingPreguntas, setIsLoadingPreguntas] = useState(true);
    const [preguntasError, setPreguntasError] = useState("");

    const loadPreguntas = useCallback(async () => {
        try {
            const questionsData = await getAdminQuestions();
            setPreguntas(questionsData);
            setPreguntasError("");
        } catch (error) {
            setPreguntas([]);
            setPreguntasError(
                error?.response?.data?.mensaje || "No se pudieron cargar las preguntas del test"
            );
        } finally {
            setIsLoadingPreguntas(false);
        }
    }, []);

    useEffect(() => {
        loadPreguntas();
    }, [loadPreguntas]);

    if (isLoadingPreguntas) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #dbe2f0"
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <CircularProgress size={22} />
                    <Typography>Cargando preguntas del test...</Typography>
                </Stack>
            </Paper>
        );
    }

    if (preguntasError) {
        return <Alert severity="error">{preguntasError}</Alert>;
    }

    return (
        <Stack spacing={2.5}>
            <Stack spacing={1}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Preguntas del test
                </Typography>

                <Typography sx={{ color: "#475569" }}>
                    Consulta las preguntas actuales y sus opciones asociadas antes de editar el
                    cuestionario.
                </Typography>
            </Stack>

            {preguntas.length === 0 ? (
                <Alert severity="info">No hay preguntas disponibles en este momento.</Alert>
            ) : (
                preguntas.map(pregunta => (
                    <Paper
                        key={pregunta.id_pregunta}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: "1px solid #dbe2f0",
                            backgroundColor: "#ffffff"
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                justifyContent="space-between"
                                spacing={1.5}
                            >
                                <Stack spacing={0.5}>
                                    <Typography variant="overline" sx={{ color: "#1d4ed8", fontWeight: 700 }}>
                                        Pregunta {pregunta.orden}
                                    </Typography>

                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {pregunta.enunciado}
                                    </Typography>
                                </Stack>

                                <Chip
                                    label={pregunta.activa ? "Activa" : "Inactiva"}
                                    color={pregunta.activa ? "success" : "default"}
                                    variant={pregunta.activa ? "filled" : "outlined"}
                                    sx={{ alignSelf: "flex-start", fontWeight: 600 }}
                                />
                            </Stack>

                            <Stack spacing={1.25}>
                                {pregunta.opciones.map(opcion => (
                                    <Paper
                                        key={opcion.id_opcion}
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: "1px solid #e2e8f0",
                                            backgroundColor: "#f8fbff"
                                        }}
                                    >
                                        <Stack
                                            direction={{ xs: "column", md: "row" }}
                                            justifyContent="space-between"
                                            spacing={1}
                                        >
                                            <Stack spacing={0.5}>
                                                <Typography sx={{ fontWeight: 600 }}>
                                                    {opcion.texto}
                                                </Typography>

                                                <Typography variant="body2" sx={{ color: "#64748b" }}>
                                                    Dimension {opcion.dimension_codigo}: {opcion.dimension_nombre}
                                                </Typography>
                                            </Stack>

                                            <Chip
                                                label={opcion.activa ? "Activa" : "Inactiva"}
                                                size="small"
                                                color={opcion.activa ? "success" : "default"}
                                                variant={opcion.activa ? "filled" : "outlined"}
                                                sx={{ alignSelf: "flex-start" }}
                                            />
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        </Stack>
                    </Paper>
                ))
            )}
        </Stack>
    );
}

export default AdminPreguntasPanel;
