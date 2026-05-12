import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";
import { createAdminCiclo, getAdminCiclos, updateAdminCiclo } from "../services/adminCicloService";
import { createAdminFamily, getAdminFamilies, updateAdminFamily } from "../services/adminFamiliaService";
import AdminCicloForm from "../components/admin/AdminCicloForm";
import AdminCicloGrid from "../components/admin/AdminCicloGrid";
import AdminFamilyForm from "../components/admin/AdminFamilyForm";
import AdminFamiliaGrid from "../components/admin/AdminFamiliaGrid";

export default function AdminDashboardPage({ admin }) {

	//1
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

	//estados de familias
    const [familias, setFamilias] = useState([]);
    const [isLoadingFamilias, setIsLoadingFamilias] = useState(true);
    const [familiasError, setFamiliasError] = useState("");

    const [familiaFormData, setFamiliaFormData] = useState({
        nombre: "",
        descripcion: ""
    });
    const [isCreatingFamilia, setIsCreatingFamilia] = useState(false);
    const [isUpdatingFamilia, setIsUpdatingFamilia] = useState(false);
    const [familiaFormError, setFamiliaFormError] = useState("");
    const [familiaFormSuccess, setFamiliaFormSuccess] = useState("");
    const [editFamilia, setEditFamilia] = useState(null);
    const [familiaMenuAnchorEl, setFamiliaMenuAnchorEl] = useState(null);
    const [selectedFamiliaForMenu, setSelectedFamiliaForMenu] = useState(null);
    const [selectedFamiliaForCiclos, setSelectedFamiliaForCiclos] = useState(null);
    //resaltar la tarjeta
    const [idFamiliaHighlight, setIdFamiliaHighlight] = useState(null);



    
    //esto solo de los ciclos, igual que familias de FP.
    const [ciclos, setCiclos] = useState([]);
    const [isLoadingCiclos, setIsLoadingCiclos] = useState(true);
    const [ciclosError, setCiclosError] = useState("");

    const [cicloFormData, setCicloFormData] = useState({
        id_familia: "",
        nombre: "",
        nivel: "GS",
        descripcion: "",
        duracion_horas: ""
    });
    const [isCreatingCiclo, setIsCreatingCiclo] = useState(false);
    const [isUpdatingCiclo, setIsUpdatingCiclo] = useState(false);
    const [cicloFormError, setCicloFormError] = useState("");
    const [cicloFormSuccess, setCicloFormSuccess] = useState("");
    const [editingCiclo, setEditingCiclo] = useState(null);
    const [cicloMenuAnchorEl, setCicloMenuAnchorEl] = useState(null);
    const [selectedCicloForMenu, setSelectedCicloForMenu] = useState(null);
	const [idCicloHighlight, setIdCicloHighlight] = useState(null);

	//4 refs y navegacion.
    const familyFormRef = useRef(null);
    const cicloFormRef = useRef(null);

    const navigate = useNavigate();

    const loadFamilias = useCallback(async () => {
        try {
            const familiasData = await getAdminFamilies();
            setFamilias(familiasData);
            setFamiliasError("");
        } catch (error) {
            setFamilias([]);
            setFamiliasError(
                error?.response?.data?.mensaje || "No se pudieron cargar las familias profesionales"
            );
        } finally {
            setIsLoadingFamilias(false);
        }
    }, []);

    const loadCiclos = useCallback(async () => {
        try {
            const ciclosData = await getAdminCiclos();
            setCiclos(ciclosData);
            setCiclosError("");
        } catch (error) {
            setCiclos([]);
            setCiclosError(
                error?.response?.data?.mensaje || "No se pudieron cargar los ciclos formativos"
            );
        } finally {
            setIsLoadingCiclos(false);
        }
    }, []);

    useEffect(() => {
        loadFamilias();
        loadCiclos();
    }, [loadFamilias, loadCiclos]);

    useEffect(() => {
        if (!editFamilia) {
            return;
        }

        const timeoutId = setTimeout(() => {
            familyFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [editFamilia]);

    useEffect(() => {
        if (!editingCiclo) {
            return;
        }

        const timeoutId = setTimeout(() => {
            cicloFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [editingCiclo]);

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

    const handleFamiliaFormChange = event => {
        const { name, value } = event.target;

        setFamiliaFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCicloFormChange = event => {
        const { name, value } = event.target;

        setCicloFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenFamiliaMenu = (event, family) => {
        setFamiliaMenuAnchorEl(event.currentTarget);
        setSelectedFamiliaForMenu(family);
    };

    const handleCloseFamiliaMenu = () => {
        setFamiliaMenuAnchorEl(null);
        setSelectedFamiliaForMenu(null);
    };

    const handleOpenCicloMenu = (event, ciclo) => {
        setCicloMenuAnchorEl(event.currentTarget);
        setSelectedCicloForMenu(ciclo);
    };

    const handleCloseCicloMenu = () => {
        setCicloMenuAnchorEl(null);
        setSelectedCicloForMenu(null);
    };

    const scrollToFamilyCard = idFamilia => {
        const familyCard = document.getElementById(`family-card-${idFamilia}`);

        familyCard?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };

    const scrollToCicloCard = idCiclo => {
        const cicloCard = document.getElementById(`ciclo-card-${idCiclo}`);

        cicloCard?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };

    const handleStartEditFamilia = () => {
        if (!selectedFamiliaForMenu) {
            return;
        }

        setEditFamilia(selectedFamiliaForMenu);
        setFamiliaFormData({
            nombre: selectedFamiliaForMenu.nombre,
            descripcion: selectedFamiliaForMenu.descripcion || ""
        });
        setFamiliaFormError("");
        setFamiliaFormSuccess("");
        handleCloseFamiliaMenu();
    };

    const handleViewFamiliaCiclos = familia => {
        setSelectedFamiliaForCiclos(familia);
        setEditingCiclo(null);
        setCicloFormError("");
        setCicloFormSuccess("");
        setCicloFormData({
            id_familia: String(familia.id_familia),
            nombre: "",
            nivel: "GS",
            descripcion: "",
            duracion_horas: ""
        });
    };

    const handleBackToFamilias = () => {
        setSelectedFamiliaForCiclos(null);
        setEditingCiclo(null);
        setSelectedCicloForMenu(null);
        setCicloFormError("");
        setCicloFormSuccess("");
    };

    const handleStartEditCiclo = () => {
        if (!selectedCicloForMenu) {
            return;
        }

        setEditingCiclo(selectedCicloForMenu);
        setCicloFormData({
            id_familia: String(selectedCicloForMenu.id_familia),
            nombre: selectedCicloForMenu.nombre,
            nivel: selectedCicloForMenu.nivel,
            descripcion: selectedCicloForMenu.descripcion || "",
            duracion_horas: selectedCicloForMenu.duracion_horas
                ? String(selectedCicloForMenu.duracion_horas)
                : ""
        });
        setCicloFormError("");
        setCicloFormSuccess("");
        handleCloseCicloMenu();
    };

    const handleCancelEditFamilia = () => {
        const familyId = editFamilia?.id_familia || null;

        setEditFamilia(null);
        setFamiliaFormData({
            nombre: "",
            descripcion: ""
        });
        setFamiliaFormError("");
        setFamiliaFormSuccess("");

        if (familyId) {
            setIdFamiliaHighlight(familyId);

            setTimeout(() => {
                scrollToFamilyCard(familyId);
            }, 0);

            setTimeout(() => {
                setIdFamiliaHighlight(null);
            }, 1800);
        }
    };

    const handleCancelEditCiclo = () => {
        const cicloId = editingCiclo?.id_ciclo || null;

        setEditingCiclo(null);
        setCicloFormData({
            id_familia: selectedFamiliaForCiclos ? String(selectedFamiliaForCiclos.id_familia) : "",
            nombre: "",
            nivel: "GS",
            descripcion: "",
            duracion_horas: ""
        });
        setCicloFormError("");
        setCicloFormSuccess("");

        if (cicloId) {
            setIdCicloHighlight(cicloId);

            setTimeout(() => {
                scrollToCicloCard(cicloId);
            }, 0);

            setTimeout(() => {
                setIdCicloHighlight(null);
            }, 1800);
        }
    };

    const handleSubmitFamiliaForm = async event => {
        event.preventDefault();
        setFamiliaFormError("");
        setFamiliaFormSuccess("");

        if (editFamilia) {
            const familyId = editFamilia.id_familia;
            setIsUpdatingFamilia(true);

            try {
                await updateAdminFamily(familyId, familiaFormData);

                setFamiliaFormSuccess("Familia profesional actualizada correctamente");
                setEditFamilia(null);
                setFamiliaFormData({
                    nombre: "",
                    descripcion: ""
                });

                setIsLoadingFamilias(true);
                await loadFamilias();

                setIdFamiliaHighlight(familyId);

                setTimeout(() => {
                    scrollToFamilyCard(familyId);
                }, 0);

                setTimeout(() => {
                    setIdFamiliaHighlight(null);
                }, 1800);
            } catch (error) {
                setFamiliaFormError(
                    error?.response?.data?.mensaje || "No se pudo actualizar la familia profesional"
                );
            } finally {
                setIsUpdatingFamilia(false);
            }

            return;
        }

        setIsCreatingFamilia(true);

        try {
            await createAdminFamily(familiaFormData);
            setFamiliaFormData({
                nombre: "",
                descripcion: ""
            });
            setFamiliaFormSuccess("Familia profesional creada correctamente");
            setIsLoadingFamilias(true);
            await loadFamilias();
        } catch (error) {
            setFamiliaFormError(
                error?.response?.data?.mensaje || "No se pudo crear la familia profesional"
            );
        } finally {
            setIsCreatingFamilia(false);
        }
    };

    const handleSubmitCicloForm = async event => {
        event.preventDefault();
        setCicloFormError("");
        setCicloFormSuccess("");

        if (editingCiclo) {
            const cicloId = editingCiclo.id_ciclo;
            setIsUpdatingCiclo(true);

            try {
                await updateAdminCiclo(cicloId, cicloFormData);

                setCicloFormSuccess("Ciclo formativo actualizado correctamente");
                setEditingCiclo(null);
                setCicloFormData({
                    id_familia: selectedFamiliaForCiclos
                        ? String(selectedFamiliaForCiclos.id_familia)
                        : "",
                    nombre: "",
                    nivel: "GS",
                    descripcion: "",
                    duracion_horas: ""
                });

                setIsLoadingCiclos(true);
                await loadCiclos();

                setIdCicloHighlight(cicloId);

                setTimeout(() => {
                    scrollToCicloCard(cicloId);
                }, 0);

                setTimeout(() => {
                    setIdCicloHighlight(null);
                }, 1800);
            } catch (error) {
                setCicloFormError(
                    error?.response?.data?.mensaje || "No se pudo actualizar el ciclo formativo"
                );
            } finally {
                setIsUpdatingCiclo(false);
            }

            return;
        }

        setIsCreatingCiclo(true);

        try {
            await createAdminCiclo(cicloFormData);

            setCicloFormData({
                id_familia: selectedFamiliaForCiclos ? String(selectedFamiliaForCiclos.id_familia) : "",
                nombre: "",
                nivel: "GS",
                descripcion: "",
                duracion_horas: ""
            });

            setCicloFormSuccess("Ciclo formativo creado correctamente");
            setIsLoadingCiclos(true);
            await loadCiclos();
        } catch (error) {
            setCicloFormError(error?.response?.data?.mensaje || "No se pudo crear el ciclo formativo");
        } finally {
            setIsCreatingCiclo(false);
        }
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
                            <Stack spacing={1.5}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Estado del area admin
                                </Typography>

                                <Typography sx={{ color: "#475569" }}>
                                    {selectedFamiliaForCiclos
                                        ? `Gestionando ciclos de ${selectedFamiliaForCiclos.nombre}.`
                                        : "El acceso admin ya funciona correctamente. Ahora el panel ya esta conectado con el listado de familias profesionales."}
                                </Typography>
                            </Stack>
                        </Paper>

                        {!selectedFamiliaForCiclos ? (
                            <>
                                <AdminFamilyForm
                                    formRef={familyFormRef}
                                    editingFamily={editFamilia}
                                    familyFormData={familiaFormData}
                                    familyFormError={familiaFormError}
                                    familyFormSuccess={familiaFormSuccess}
                                    isCreatingFamily={isCreatingFamilia}
                                    isUpdatingFamily={isUpdatingFamilia}
                                    onChange={handleFamiliaFormChange}
                                    onSubmit={handleSubmitFamiliaForm}
                                    onCancelEdit={handleCancelEditFamilia}
                                />

                                <AdminFamiliaGrid
                                    families={familias}
                                    isLoadingFamilies={isLoadingFamilias}
                                    familiesError={familiasError}
                                    familyMenuAnchorEl={familiaMenuAnchorEl}
                                    selectedFamilyForMenu={selectedFamiliaForMenu}
                                    onOpenFamilyMenu={handleOpenFamiliaMenu}
                                    onCloseFamilyMenu={handleCloseFamiliaMenu}
                                    onStartEditFamily={handleStartEditFamilia}
                                    onViewFamilyCiclos={handleViewFamiliaCiclos}
									idFamiliaHighlight={idFamiliaHighlight}

                                />
                            </>
                        ) : (
                            <>
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    justifyContent="space-between"
                                    alignItems={{
                                        xs: "flex-start",
                                        sm: "center"
                                    }}
                                    spacing={2}
                                >
                                    <Stack spacing={1}>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Ciclos formativos
                                        </Typography>

                                        <Typography sx={{ color: "#475569" }}>
                                            Familia actual: {selectedFamiliaForCiclos.nombre}
                                        </Typography>
                                    </Stack>

                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={handleBackToFamilias}
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 600,
                                            borderRadius: 999,
                                            px: 2.5
                                        }}
                                    >
                                        Volver a familias
                                    </Button>
                                </Stack>

                                <AdminCicloForm
                                    formRef={cicloFormRef}
                                    editingCiclo={editingCiclo}
                                    cicloFormData={cicloFormData}
                                    cicloFormError={cicloFormError}
                                    cicloFormSuccess={cicloFormSuccess}
                                    isCreatingCiclo={isCreatingCiclo}
                                    isUpdatingCiclo={isUpdatingCiclo}
                                    families={[selectedFamiliaForCiclos]}
                                    onChange={handleCicloFormChange}
                                    onSubmit={handleSubmitCicloForm}
                                    onCancelEdit={handleCancelEditCiclo}
                                />

                                <AdminCicloGrid
                                    selectedFamilyForCiclos={selectedFamiliaForCiclos}
                                    ciclos={ciclos}
                                    isLoadingCiclos={isLoadingCiclos}
                                    ciclosError={ciclosError}
                                    cicloMenuAnchorEl={cicloMenuAnchorEl}
                                    onOpenCicloMenu={handleOpenCicloMenu}
                                    onCloseCicloMenu={handleCloseCicloMenu}
                                    onStartEditCiclo={handleStartEditCiclo}
									idCicloHighlight={idCicloHighlight}
                                />
                            </>
                        )}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
