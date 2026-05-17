import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField
} from "@mui/material";

const RI_ASEC_OPTIONS = [
    { codigo: "R", nombre: "Realista" },
    { codigo: "I", nombre: "Investigador" },
    { codigo: "A", nombre: "Artistico" },
    { codigo: "S", nombre: "Social" },
    { codigo: "E", nombre: "Emprendedor" },
    { codigo: "C", nombre: "Convencional" }
];

const initialQuestionForm = questionForEdit => {
    if (!questionForEdit) {
        return {
            enunciado: "",
            orden: "",
            opciones: []
        };
    }

    return {
        enunciado: questionForEdit.enunciado || "",
        orden: questionForEdit.orden ? String(questionForEdit.orden) : "",
        opciones: questionForEdit.opciones.map(opcion => ({
            id_opcion: opcion.id_opcion,
            texto: opcion.texto || "",
            dimension_codigo: opcion.dimension_codigo || ""
        }))
    };
};

function AdminPreguntaFormDialog({ open, questionForEdit, onClose, onSave }) {
    const [questionFormData, setQuestionFormData] = useState(initialQuestionForm(questionForEdit));
    const [questionFormError, setQuestionFormError] = useState("");
    const [isSavingQuestion, setIsSavingQuestion] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setQuestionFormData(initialQuestionForm(questionForEdit));
        setQuestionFormError("");
        setIsSavingQuestion(false);
    }, [open, questionForEdit]);

    const handleQuestionFieldChange = event => {
        const { name, value } = event.target;

        setQuestionFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionFieldChange = (index, field, value) => {
        setQuestionFormData(prev => ({
            ...prev,
            opciones: prev.opciones.map((opcion, optionIndex) =>
                optionIndex === index
                    ? {
                          ...opcion,
                          [field]: value
                      }
                    : opcion
            )
        }));
    };

    const handleSubmitQuestionForm = async event => {
        event.preventDefault();
        setQuestionFormError("");
        setIsSavingQuestion(true);

        try {
            await onSave(questionFormData);
            onClose();
        } catch (error) {
            setQuestionFormError(error?.response?.data?.mensaje || "No se pudo guardar la pregunta");
        } finally {
            setIsSavingQuestion(false);
        }
    };

    return (
        <Dialog open={open} onClose={isSavingQuestion ? undefined : onClose} fullWidth maxWidth="md">
            <DialogTitle>Editar pregunta</DialogTitle>

            <DialogContent dividers>
                <Stack
                    component="form"
                    id="admin-question-form"
                    spacing={2.5}
                    onSubmit={handleSubmitQuestionForm}
                    sx={{ pt: 1 }}
                >
                    {questionFormError ? <Alert severity="error">{questionFormError}</Alert> : null}

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            fullWidth
                            label="Enunciado"
                            name="enunciado"
                            value={questionFormData.enunciado}
                            onChange={handleQuestionFieldChange}
                        />

                        <TextField
                            label="Orden"
                            name="orden"
                            value={questionFormData.orden}
                            disabled
                            sx={{ width: { xs: "100%", sm: 140 } }}
                        />
                    </Stack>

                    <Stack spacing={2}>
                        {questionFormData.opciones.map((opcion, index) => (
                            <Stack
                                key={opcion.id_opcion || index}
                                direction={{ xs: "column", md: "row" }}
                                spacing={2}
                            >
                                <TextField
                                    fullWidth
                                    label={`Respuesta ${index + 1}`}
                                    value={opcion.texto}
                                    onChange={event =>
                                        handleOptionFieldChange(index, "texto", event.target.value)
                                    }
                                />

                                <TextField
                                    select
                                    label="Perfil RIASEC"
                                    value={opcion.dimension_codigo}
                                    onChange={event =>
                                        handleOptionFieldChange(
                                            index,
                                            "dimension_codigo",
                                            event.target.value
                                        )
                                    }
                                    sx={{ width: { xs: "100%", md: 220 } }}
                                >
                                    {RI_ASEC_OPTIONS.map(option => (
                                        <MenuItem key={option.codigo} value={option.codigo}>
                                            {option.codigo} - {option.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={isSavingQuestion} sx={{ textTransform: "none" }}>
                    Descartar
                </Button>

                <Button
                    type="submit"
                    form="admin-question-form"
                    variant="contained"
                    disabled={isSavingQuestion}
                    startIcon={isSavingQuestion ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                >
                    {isSavingQuestion ? "Guardando..." : "Guardar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AdminPreguntaFormDialog;
