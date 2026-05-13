import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    LinearProgress,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    createTestResponse,
    finalizeTest,
    getTestQuestions,
    getTestResponses,
    updateTestResponse
} from "../services/testService";
import { getTestUuid } from "../services/testSession";

export default function TestFlowPage() {
    const navigate = useNavigate();
    const uuid = getTestUuid();
    const [questions, setQuestions] = useState([]);
    const [responsesByQuestion, setResponsesByQuestion] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIds, setSelectedOptionIds] = useState([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
    const [isSavingResponses, setIsSavingResponses] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadQuestions() {
            if (!uuid) {
                setErrorMessage("No se ha encontrado una sesión activa del test.");
                setIsLoadingQuestions(false);
                return;
            }

            setIsLoadingQuestions(true);
            setErrorMessage("");

            try {
                const [loadedQuestions, loadedResponses] = await Promise.all([
                    getTestQuestions(uuid),
                    getTestResponses(uuid)
                ]);

                const groupedResponses = loadedResponses.reduce((acc, response) => {
                    if (!acc[response.id_pregunta]) {
                        acc[response.id_pregunta] = [];
                    }

                    acc[response.id_pregunta].push(response);
                    return acc;
                }, {});

                const firstIncompleteQuestionIndex = loadedQuestions.findIndex(question => {
                    const savedResponses = groupedResponses[question.id_pregunta] || [];
                    return savedResponses.length < 2;
                });

                setQuestions(loadedQuestions);
                setResponsesByQuestion(groupedResponses);

                if (firstIncompleteQuestionIndex >= 0) {
                    setCurrentQuestionIndex(firstIncompleteQuestionIndex);
                }
            } catch (error) {
                let message = "No se pudieron cargar las preguntas del test.";

                if (error.response && error.response.data && error.response.data.mensaje) {
                    message = error.response.data.mensaje;
                }

                setErrorMessage(message);
            } finally {
                setIsLoadingQuestions(false);
            }
        }

        loadQuestions();
    }, [uuid]);

    useEffect(() => {
        const currentQuestion = questions[currentQuestionIndex];

        if (!currentQuestion) {
            setSelectedOptionIds([]);
            return;
        }

        const savedResponses = responsesByQuestion[currentQuestion.id_pregunta] || [];
        const savedOptionIds = savedResponses.map(response => response.id_opcion);

        setSelectedOptionIds(savedOptionIds);
    }, [questions, currentQuestionIndex, responsesByQuestion]);

    const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
    const totalQuestions = questions.length;
    const currentQuestionNumber = currentQuestion ? currentQuestionIndex + 1 : 0;
    const progressValue = totalQuestions > 0 ? (currentQuestionNumber / totalQuestions) * 100 : 0;

    function handleOptionToggle(optionId) {
        const isSelected = selectedOptionIds.includes(optionId);

        if (isSelected) {
            const updatedOptionIds = selectedOptionIds.filter(id => id !== optionId);
            setSelectedOptionIds(updatedOptionIds);
            setErrorMessage("");
            return;
        }

        if (selectedOptionIds.length >= 2) {
            setErrorMessage("Solo puedes seleccionar un máximo de 2 opciones por pregunta.");
            return;
        }

        setErrorMessage("");
        setSelectedOptionIds([...selectedOptionIds, optionId]);
    }

    async function saveCurrentQuestionResponses() {
        if (!currentQuestion || !uuid) {
            return;
        }

        if (selectedOptionIds.length !== 2) {
            setErrorMessage("Debes seleccionar exactamente 2 opciones antes de continuar.");
            return;
        }

        setIsSavingResponses(true);
        setErrorMessage("");

        try {
            const currentSavedResponses = responsesByQuestion[currentQuestion.id_pregunta] || [];
            const responsesToKeep = currentSavedResponses.filter(response =>
                selectedOptionIds.includes(response.id_opcion)
            );
            const responsesToReplace = currentSavedResponses.filter(
                response => !selectedOptionIds.includes(response.id_opcion)
            );
            const optionIdsToPersist = selectedOptionIds.filter(
                optionId => !currentSavedResponses.some(response => response.id_opcion === optionId)
            );
            const updatedResponses = [...responsesToKeep];

            for (
                let index = 0;
                index < responsesToReplace.length && index < optionIdsToPersist.length;
                index += 1
            ) {
                const updatedResponse = await updateTestResponse(
                    uuid,
                    responsesToReplace[index].id_respuesta,
                    {
                        id_opcion: optionIdsToPersist[index]
                    }
                );

                updatedResponses.push(updatedResponse);
            }

            for (let index = responsesToReplace.length; index < optionIdsToPersist.length; index += 1) {
                const createdResponse = await createTestResponse(uuid, {
                    id_pregunta: currentQuestion.id_pregunta,
                    id_opcion: optionIdsToPersist[index]
                });

                updatedResponses.push(createdResponse);
            }

            const normalizedResponses = updatedResponses.sort(
                (left, right) => left.id_opcion - right.id_opcion
            );

            setResponsesByQuestion(previousState => ({
                ...previousState,
                [currentQuestion.id_pregunta]: normalizedResponses
            }));

            if (currentQuestionIndex === totalQuestions - 1) {
                const result = await finalizeTest(uuid);

                navigate("/test/resultado", {
                    // Se envia tambien el UUID para permitir generar un enlace temporal.
                    state: { result, testUuid: uuid }
                });
                return;
            }

            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } catch (error) {
            let message = "No se pudieron guardar las respuestas.";

            if (error.response && error.response.data && error.response.data.mensaje) {
                message = error.response.data.mensaje;
            }

            setErrorMessage(message);
        } finally {
            setIsSavingResponses(false);
        }
    }

    function goToPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f6f7fb 100%)",
                py: 8
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        border: "1px solid #dbe2f0",
                        backgroundColor: "rgba(255, 255, 255, 0.92)"
                    }}
                >
                    <Stack spacing={3}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#64748b",
                                fontStyle: "italic"
                            }}
                        >
                            “La única forma de hacer un gran trabajo es amar lo que haces.” - Steve Jobs
                        </Typography>

                        <Typography
                            variant="overline"
                            sx={{
                                color: "#1d4ed8",
                                fontWeight: 700,
                                letterSpacing: "0.08em"
                            }}
                        >
                            Test vocacional
                        </Typography>

                        {!isLoadingQuestions && currentQuestion && (
                            <Stack spacing={1}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 2
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: "#475569" }}>
                                        Pregunta {currentQuestionNumber} de {totalQuestions}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                                        {Math.round(progressValue)}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={progressValue}
                                    sx={{
                                        height: 8,
                                        borderRadius: 999,
                                        backgroundColor: "#dbeafe",
                                        "& .MuiLinearProgress-bar": {
                                            borderRadius: 999,
                                            backgroundColor: "#1d4ed8"
                                        }
                                    }}
                                />
                                <Typography variant="body2" sx={{ color: "#64748b" }}>
                                    Selecciona 2 opciones de las 4 disponibles.
                                </Typography>
                            </Stack>
                        )}

                        {isLoadingQuestions && (
                            <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                                <CircularProgress />
                                <Typography variant="body1" sx={{ color: "#475569" }}>
                                    Cargando preguntas del test...
                                </Typography>
                            </Stack>
                        )}

                        {!isLoadingQuestions && errorMessage !== "" && (
                            <Alert severity="error">{errorMessage}</Alert>
                        )}

                        {!isLoadingQuestions && currentQuestion && (
                            <>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: "2.2rem", md: "3.2rem" },
                                        lineHeight: 1.08
                                    }}
                                >
                                    {currentQuestion.enunciado}
                                </Typography>

                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: "1px solid #dbe2f0",
                                        backgroundColor: "#f8fbff"
                                    }}
                                >
                                    <Stack spacing={1.5}>
                                        {currentQuestion.opciones.map(option => (
                                            <Box
                                                key={option.id_opcion}
                                                onClick={() => handleOptionToggle(option.id_opcion)}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: selectedOptionIds.includes(option.id_opcion)
                                                        ? "2px solid #1d4ed8"
                                                        : "1px solid #dbe2f0",
                                                    backgroundColor: selectedOptionIds.includes(
                                                        option.id_opcion
                                                    )
                                                        ? "#eaf1ff"
                                                        : "#ffffff",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ color: "#334155" }}>
                                                    {option.texto}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </>
                        )}

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Button
                                onClick={goToPreviousQuestion}
                                variant="outlined"
                                disabled={currentQuestionIndex === 0 || isSavingResponses}
                                sx={{
                                    alignSelf: "flex-start",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 999,
                                    px: 3
                                }}
                            >
                                Anterior
                            </Button>
                            <Button
                                onClick={saveCurrentQuestionResponses}
                                disabled={isSavingResponses || !currentQuestion}
                                variant="contained"
                                sx={{
                                    alignSelf: "flex-start",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 999,
                                    px: 3,
                                    backgroundColor: "#1d4ed8",
                                    boxShadow: "none",
                                    "&:hover": {
                                        backgroundColor: "#1e40af",
                                        boxShadow: "none"
                                    }
                                }}
                            >
                                {isSavingResponses
                                    ? currentQuestionIndex === totalQuestions - 1
                                        ? "Preparando resultados..."
                                        : "Guardando..."
                                    : currentQuestionIndex === totalQuestions - 1
                                      ? "Ver resultados"
                                      : "Continuar"}
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/test"
                                variant="text"
                                sx={{
                                    alignSelf: "flex-start",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    color: "#94a3b8",
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                        color: "#64748b"
                                    }
                                }}
                            >
                                Salir del test
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
