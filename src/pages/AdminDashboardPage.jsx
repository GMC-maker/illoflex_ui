import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";
import AdminCiclosPanel from "../components/admin/AdminCiclosPanel";
import AdminFamiliasPanel from "../components/admin/AdminFamiliasPanel";
import AdminPreguntasPanel from "../components/admin/AdminPreguntasPanel";

export default function AdminDashboardPage({ admin }) {
    //estados generales
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFamiliaForCiclos, setSelectedFamiliaForCiclos] = useState(null);
    const [selectedAdminSection, setSelectedAdminSection] = useState("preguntas");

    const navigate = useNavigate();

    const handleViewFamiliaCiclos = familia => {
        setSelectedFamiliaForCiclos(familia);
    };

    const handleLogout = async () => {
        setErrorMessage("");
        setIsLoggingOut(true);

        try {
            await logoutAdmin();
            navigate("/admin/login", { replace: true });
        } catch (error) {
            setErrorMessage(
                error?.response?.data?.mensaje || "No se pudo cerrar la sesion de administrador"
            );
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleBackToFamilias = () => {
        setSelectedFamiliaForCiclos(null);
    };

    const handleAdminSectionChange = (event, nextSection) => {
        if (!nextSection) {
            return;
        }

        setSelectedAdminSection(nextSection);
        setSelectedFamiliaForCiclos(null);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f6f7fb 100%)",
                py: 8
            }}
        >
            <Container maxWidth="lg">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 5 },
                        borderRadius: 4,
                        border: "1px solid #dbe2f0",
                        backgroundColor: "rgba(255, 255, 255, 0.96)"
                    }}
                >
                    <Stack spacing={3}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={2}
                        >
                            <Stack spacing={1}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "#1d4ed8",
                                        fontWeight: 700,
                                        letterSpacing: "0.08em"
                                    }}
                                >
                                    Area interna
                                </Typography>

                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    Panel de administracion
                                </Typography>

                                <Typography sx={{ color: "#475569" }}>
                                    Sesion iniciada como {admin.email}.
                                </Typography>
                            </Stack>

                            <Button
                                variant="outlined"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 999,
                                    px: 2.5
                                }}
                            >
                                {isLoggingOut ? "Cerrando sesion..." : "Cerrar sesion"}
                            </Button>
                        </Stack>

                        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: "1px solid #dbe2f0",
                                backgroundColor: "#f8fbff"
                            }}
                        >
                            <Stack spacing={2}>
                                <Stack spacing={0.75}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        Panel de gestion
                                    </Typography>

                                    <Typography sx={{ color: "#475569" }}>
                                        Selecciona el bloque con el que quieres trabajar en el area
                                        admin.
                                    </Typography>
                                </Stack>

                                <ToggleButtonGroup
                                    value={selectedAdminSection}
                                    exclusive
                                    onChange={handleAdminSectionChange}
                                    sx={{
                                        alignSelf: "flex-start",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        "& .MuiToggleButtonGroup-grouped": {
                                            textTransform: "none",
                                            fontWeight: 600,
                                            px: 2.5,
                                            py: 1,
                                            border: "2px solid #94a3b8",
                                            borderRadius: "0 !important"
                                        },
                                        "& .MuiToggleButtonGroup-grouped.Mui-selected": {
                                            backgroundColor: "#e0ecff",
                                            color: "#1d4ed8"
                                        }
                                    }}
                                >
                                    <ToggleButton value="preguntas">Preguntas del test</ToggleButton>

                                    <ToggleButton value="catalogo">Familias y ciclos</ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                        </Paper>

                        {selectedAdminSection === "preguntas" ? (
                            <AdminPreguntasPanel />
                        ) : !selectedFamiliaForCiclos ? (
                            <AdminFamiliasPanel onViewFamiliaCiclos={handleViewFamiliaCiclos} />
                        ) : (
                            <AdminCiclosPanel
                                selectedFamiliaForCiclos={selectedFamiliaForCiclos}
                                onBackToFamilias={handleBackToFamilias}
                            />
                        )}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
