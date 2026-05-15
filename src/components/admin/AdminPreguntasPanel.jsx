import { AddRounded, EditOutlined } from "@mui/icons-material";
import {
    Alert,
    Box,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";
import { getAdminQuestions } from "../../services/adminPreguntaService";

function AdminPreguntasPanel() {
    const [preguntas, setPreguntas] = useState([]);
    const [isLoadingPreguntas, setIsLoadingPreguntas] = useState(true);
    const [preguntasError, setPreguntasError] = useState("");
    const [idPreguntaSeleccionada, setIdPreguntaSeleccionada] = useState(null);

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

    const handleSelectQuestionForEdit = pregunta => {
        setIdPreguntaSeleccionada(pregunta.id_pregunta);
    };

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
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
            >
                <Stack spacing={1}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Preguntas del test
                    </Typography>

                    <Typography sx={{ color: "#475569" }}>
                        Consulta las preguntas actuales y sus opciones asociadas antes de editar el
                        cuestionario.
                    </Typography>
                </Stack>

                <IconButton
                    aria-label="Agregar pregunta"
                    sx={{
                        width: 42,
                        height: 42,
                        backgroundColor: "#1976d2",
                        color: "#ffffff",
                        alignSelf: { xs: "flex-start", sm: "center" },
                        "&:hover": {
                            backgroundColor: "#1565c0"
                        }
                    }}
                >
                    <AddRounded sx={{ fontSize: 24 }} />
                </IconButton>
            </Stack>

            {preguntas.length === 0 ? (
                <Alert severity="info">No hay preguntas disponibles en este momento.</Alert>
            ) : (
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid #dbe2f0",
                        overflow: "hidden"
                    }}
                >
                    <Table
                        sx={{
                            tableLayout: "fixed",
                            "& th": {
                                whiteSpace: "nowrap"
                            },
                            "& td": {
                                whiteSpace: "normal"
                            }
                        }}
                    >
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f8fbff" }}>
                                <TableCell
                                    sx={{
                                        width: "7%",
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        fontSize: { xs: "0.76rem", sm: "0.82rem", md: "0.88rem" },
                                        whiteSpace: "nowrap",
                                        px: { xs: 1.25, sm: 2 }
                                    }}
                                >
                                    Orden
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: "23%",
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        fontSize: { xs: "0.76rem", sm: "0.82rem", md: "0.88rem" },
                                        whiteSpace: "nowrap",
                                        px: { xs: 1.25, sm: 2 }
                                    }}
                                >
                                    Pregunta
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: "50%",
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        fontSize: { xs: "0.76rem", sm: "0.82rem", md: "0.88rem" },
                                        whiteSpace: "nowrap",
                                        px: { xs: 1.25, sm: 2 }
                                    }}
                                >
                                    Respuestas
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: "12%",
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        fontSize: { xs: "0.76rem", sm: "0.82rem", md: "0.88rem" },
                                        whiteSpace: "nowrap",
                                        textAlign: "right",
                                        px: { xs: 1.25, sm: 2 }
                                    }}
                                >
                                    Activa
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: "8%",
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        fontSize: { xs: "0.76rem", sm: "0.82rem", md: "0.88rem" },
                                        whiteSpace: "nowrap",
                                        textAlign: "right",
                                        px: { xs: 1.25, sm: 2 }
                                    }}
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {preguntas.map(pregunta => (
                                <TableRow
                                    key={pregunta.id_pregunta}
                                    hover
                                    selected={idPreguntaSeleccionada === pregunta.id_pregunta}
                                >
                                    <TableCell
                                        sx={{
                                            verticalAlign: "top",
                                            textAlign: "center",
                                            fontWeight: 600,
                                            fontSize: { xs: "0.82rem", sm: "0.9rem" },
                                            px: { xs: 1.25, sm: 2 },
                                            py: 2
                                        }}
                                    >
                                        {pregunta.orden}
                                    </TableCell>

                                    <TableCell
                                        sx={{ verticalAlign: "top", px: { xs: 1.25, sm: 2 }, py: 2 }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 500,
                                                color: "#0f172a",
                                                fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                                                lineHeight: 1.45
                                            }}
                                        >
                                            {pregunta.enunciado}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{ verticalAlign: "top", px: { xs: 1.25, sm: 2 }, py: 2 }}
                                    >
                                        <Stack spacing={1.25}>
                                            {pregunta.opciones.map(opcion => (
                                                <Stack
                                                    key={opcion.id_opcion}
                                                    direction="row"
                                                    spacing={1.25}
                                                    alignItems="center"
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 30,
                                                            height: 30,
                                                            borderRadius: "50%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: 700,
                                                            fontSize: "0.85rem",
                                                            color: "#1d4ed8",
                                                            backgroundColor: "#e0ecff",
                                                            border: "1px solid #bfdbfe",
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        {opcion.dimension_codigo}
                                                    </Box>

                                                    <Typography
                                                        sx={{
                                                            color: "#334155",
                                                            fontSize: {
                                                                xs: "0.86rem",
                                                                sm: "0.92rem",
                                                                md: "0.98rem"
                                                            },
                                                            lineHeight: 1.45
                                                        }}
                                                    >
                                                        {opcion.texto}
                                                    </Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            verticalAlign: "top",
                                            textAlign: "right",
                                            px: { xs: 1, sm: 1.5 },
                                            py: 2
                                        }}
                                    >
                                        <Switch
                                            checked={pregunta.activa}
                                            disabled
                                            inputProps={{
                                                "aria-label": `Estado de la pregunta ${pregunta.orden}`
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            verticalAlign: "top",
                                            textAlign: "right",
                                            px: { xs: 1, sm: 1.5 },
                                            py: 2
                                        }}
                                    >
                                        <Tooltip title="Preparar edicion de la pregunta">
                                            <IconButton
                                                onClick={() => handleSelectQuestionForEdit(pregunta)}
                                                aria-label={`Editar pregunta ${pregunta.orden}`}
                                            >
                                                <EditOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Stack>
    );
}

export default AdminPreguntasPanel;
