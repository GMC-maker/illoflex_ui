import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Alert, Box, Button, IconButton, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";

const CATALOG_URLS_BY_LEVEL = {
    GS: "https://www.juntadeandalucia.es/educacion/portales/web/formacion-profesional-andaluza/grado-superior-catalogo-de-titulos",
    GM: "https://www.juntadeandalucia.es/educacion/portales/web/formacion-profesional-andaluza/grado-medio-catalogo-de-titulos",
    GB: "https://www.juntadeandalucia.es/educacion/portales/web/formacion-profesional-andaluza/grado-basico-catalogo-de-titulos"
};

const getNivelLabel = nivel => {
    if (nivel === "GS") {
        return "Grado Superior";
    }

    if (nivel === "GM") {
        return "Grado Medio";
    }

    if (nivel === "GB") {
        return "Grado Basico";
    }

    return nivel;
};

const getCatalogUrlByLevel = nivel => {
    return CATALOG_URLS_BY_LEVEL[nivel] || null;
};

export default function AdminCicloGrid({
    selectedFamilyForCiclos,
    ciclos,
    isLoadingCiclos,
    ciclosError,
    cicloMenuAnchorEl,
    onOpenCicloMenu,
    onCloseCicloMenu,
    onStartEditCiclo,
    onDeleteCiclo,
    isDeletingCiclo,
    idCicloHighlight
}) {
    const ciclosOfSelectedFamily = selectedFamilyForCiclos
        ? ciclos.filter(ciclo => Number(ciclo.id_familia) === Number(selectedFamilyForCiclos.id_familia))
        : [];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #dbe2f0",
                backgroundColor: "#ffffff"
            }}
        >
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Ciclos de {selectedFamilyForCiclos.nombre}
                </Typography>

                {isLoadingCiclos ? (
                    <Typography sx={{ color: "#475569" }}>Cargando ciclos...</Typography>
                ) : null}

                {ciclosError ? <Alert severity="error">{ciclosError}</Alert> : null}

                {!isLoadingCiclos && !ciclosError && ciclosOfSelectedFamily.length === 0 ? (
                    <Alert severity="info">
                        Aun no hay ciclos cargados para esta familia profesional.
                    </Alert>
                ) : null}

                {!isLoadingCiclos && !ciclosError ? (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)"
                            },
                            gap: 2
                        }}
                    >
                        {ciclosOfSelectedFamily.map(ciclo => {
                            const catalogUrl = getCatalogUrlByLevel(ciclo.nivel);

                            return (
                                <Box
                                    key={ciclo.id_ciclo}
                                    id={`ciclo-card-${ciclo.id_ciclo}`}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2.5,
                                        border:
                                            idCicloHighlight === ciclo.id_ciclo
                                                ? "2px solid #1d4ed8"
                                                : "1px solid #dbe2f0",
                                        backgroundColor:
                                            idCicloHighlight === ciclo.id_ciclo ? "#dbeafe" : "#f8fbff",
                                        boxShadow:
                                            idCicloHighlight === ciclo.id_ciclo
                                                ? "0 0 0 3px rgba(29, 78, 216, 0.12)"
                                                : "none",
                                        transition: "all 0.25s ease"
                                    }}
                                >
                                    <Stack spacing={1.5}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                            spacing={1}
                                        >
                                            <Stack spacing={0.5}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: "#1f2937"
                                                    }}
                                                >
                                                    {ciclo.nombre}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#1d4ed8",
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {getNivelLabel(ciclo.nivel)}
                                                </Typography>
                                            </Stack>

                                            <IconButton
                                                size="small"
                                                onClick={event => onOpenCicloMenu(event, ciclo)}
                                                sx={{ color: "#475569" }}
                                            >
                                                <SettingsOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>

                                        <Typography variant="body2" sx={{ color: "#475569" }}>
                                            {ciclo.descripcion || "Sin descripcion"}
                                        </Typography>

                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            {ciclo.duracion_horas
                                                ? `${ciclo.duracion_horas} horas`
                                                : "Duracion no indicada"}
                                        </Typography>

                                        {catalogUrl ? (
                                            <Button
                                                component="a"
                                                href={catalogUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    alignSelf: "flex-start",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    borderRadius: 999,
                                                    px: 2
                                                }}
                                            >
                                                Ver detalle oficial
                                            </Button>
                                        ) : null}
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Box>
                ) : null}

                <Menu
                    anchorEl={cicloMenuAnchorEl}
                    open={Boolean(cicloMenuAnchorEl)}
                    onClose={onCloseCicloMenu}
                >
                    <MenuItem onClick={onStartEditCiclo}>Editar</MenuItem>
                    <MenuItem onClick={onDeleteCiclo} disabled={isDeletingCiclo}>
                        Eliminar
                    </MenuItem>
                </Menu>
            </Stack>
        </Paper>
    );
}
