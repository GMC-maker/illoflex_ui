import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";

const NIVELES_CICLO = [
    { value: "GS", label: "Grado Superior" },
    { value: "GM", label: "Grado Medio" },
    { value: "GB", label: "Grado Basico" }
];

export default function AdminCicloForm({
    editingCiclo,
    cicloFormData,
    cicloFormError,
    cicloFormSuccess,
    isCreatingCiclo,
    isUpdatingCiclo,
    families,
    onChange,
    onSubmit,
    onCancelEdit,
    formRef
}) {
    return (
        <Paper
            ref={formRef}
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #dbe2f0",
                backgroundColor: "#ffffff"
            }}
        >
            <Stack spacing={2.5}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {editingCiclo ? "Editar ciclo formativo" : "Nuevo ciclo formativo"}
                </Typography>

                {cicloFormError ? <Alert severity="error">{cicloFormError}</Alert> : null}

                {cicloFormSuccess ? <Alert severity="success">{cicloFormSuccess}</Alert> : null}

                <Box component="form" onSubmit={onSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="Familia profesional"
                            name="id_familia"
                            value={cicloFormData.id_familia}
                            onChange={onChange}
                            required
                            fullWidth
                        >
                            {families.map(family => (
                                <MenuItem key={family.id_familia} value={String(family.id_familia)}>
                                    {family.nombre}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Nombre del ciclo"
                            name="nombre"
                            value={cicloFormData.nombre}
                            onChange={onChange}
                            required
                            fullWidth
                        />

                        <TextField
                            select
                            label="Nivel"
                            name="nivel"
                            value={cicloFormData.nivel}
                            onChange={onChange}
                            required
                            fullWidth
                        >
                            {NIVELES_CICLO.map(nivel => (
                                <MenuItem key={nivel.value} value={nivel.value}>
                                    {nivel.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Duracion en horas"
                            name="duracion_horas"
                            type="number"
                            value={cicloFormData.duracion_horas}
                            onChange={onChange}
                            inputProps={{ min: 1 }}
                            fullWidth
                        />

                        <TextField
                            label="Descripcion"
                            name="descripcion"
                            value={cicloFormData.descripcion}
                            onChange={onChange}
                            multiline
                            minRows={3}
                            fullWidth
                        />

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isCreatingCiclo || isUpdatingCiclo}
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
                                {editingCiclo
                                    ? isUpdatingCiclo
                                        ? "Guardando cambios..."
                                        : "Guardar cambios"
                                    : isCreatingCiclo
                                      ? "Guardando..."
                                      : "Crear ciclo"}
                            </Button>

                            {editingCiclo ? (
                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={onCancelEdit}
                                    disabled={isUpdatingCiclo}
                                    sx={{
                                        alignSelf: "flex-start",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        borderRadius: 999,
                                        px: 3
                                    }}
                                >
                                    Cancelar edicion
                                </Button>
                            ) : null}
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
}
