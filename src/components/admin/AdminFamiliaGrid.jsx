import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
    Alert,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";

export default function AdminFamiliaGrid({
    families,
    ciclos,
    isLoadingFamilies,
    familiesError,
    familyMenuAnchorEl,
    selectedFamilyForMenu,
    onOpenFamilyMenu,
    onCloseFamilyMenu,
    onStartEditFamily,
    onDeleteFamily,
    isDeletingFamily,
    onViewFamilyCiclos,
    idFamiliaHighlight
}) {
    const selectedFamilyHasCiclos = selectedFamilyForMenu
        ? ciclos.some(ciclo => Number(ciclo.id_familia) === Number(selectedFamilyForMenu.id_familia))
        : false;

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
                    Familias profesionales
                </Typography>

                {isLoadingFamilies ? (
                    <Typography sx={{ color: "#475569" }}>Cargando familias...</Typography>
                ) : null}

                {familiesError ? <Alert severity="error">{familiesError}</Alert> : null}

                {!isLoadingFamilies && !familiesError && families.length === 0 ? (
                    <Alert severity="info">No hay familias profesionales cargadas.</Alert>
                ) : null}

                {!isLoadingFamilies && !familiesError ? (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                lg: "repeat(3, 1fr)"
                            },
                            gap: 2
                        }}
                    >
                        {families.map(family => (
                            <Box
                                key={family.id_familia}
                                id={`family-card-${family.id_familia}`}
                                sx={{
                                    p: 2,
                                    borderRadius: 2.5,
                                    border:
                                        idFamiliaHighlight === family.id_familia
                                            ? "2px solid #1d4ed8"
                                            : "1px solid #dbe2f0",
                                    //la tarjeta se pinta despues de un edit, cambia el background y shadow.
                                    backgroundColor:
                                        idFamiliaHighlight === family.id_familia ? "#dbeafe" : "#f8fbff",
                                    boxShadow:
                                        idFamiliaHighlight === family.id_familia
                                            ? "0 0 0 3px rgba(29, 78, 216, 0.12)"
                                            : "none",
                                    transition: "all 0.25s ease",
                                    height: "100%"
                                }}
                            >
                                <Stack spacing={2} sx={{ height: "100%" }}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        spacing={1}
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{ fontWeight: 700, color: "#1f2937" }}
                                        >
                                            {family.nombre}
                                        </Typography>

                                        <IconButton
                                            size="small"
                                            onClick={event => onOpenFamilyMenu(event, family)}
                                            sx={{ color: "#475569" }}
                                        >
                                            <SettingsOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>

                                    <Typography variant="body2" sx={{ color: "#475569", flexGrow: 1 }}>
                                        {family.descripcion || "Sin descripcion"}
                                    </Typography>

                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={() => onViewFamilyCiclos(family)}
                                        sx={{
                                            alignSelf: "flex-start",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            borderRadius: 999,
                                            px: 2.5
                                        }}
                                    >
                                        Ver ciclos
                                    </Button>
                                </Stack>
                            </Box>
                        ))}
                    </Box>
                ) : null}

                <Menu
                    anchorEl={familyMenuAnchorEl}
                    open={Boolean(familyMenuAnchorEl)}
                    onClose={onCloseFamilyMenu}
                >
                    <MenuItem onClick={onStartEditFamily}>Editar</MenuItem>
                    <Tooltip
                        title={
                            selectedFamilyHasCiclos
                                ? "No se puede eliminar porque esta familia tiene ciclos asociados"
                                : ""
                        }
                        placement="left"
                    >
                        <span>
                            <MenuItem
                                onClick={onDeleteFamily}
                                disabled={isDeletingFamily || selectedFamilyHasCiclos}
                            >
                                Eliminar
                            </MenuItem>
                        </span>
                    </Tooltip>
                </Menu>
            </Stack>
        </Paper>
    );
}
