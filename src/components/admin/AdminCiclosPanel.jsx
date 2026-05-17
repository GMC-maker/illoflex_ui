import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import {
    createAdminCiclo,
    getAdminCiclos,
    updateAdminCiclo,
    deleteAdminCiclo
} from "../../services/adminCicloService";
import AdminCicloForm from "./AdminCicloForm";
import AdminCicloGrid from "./AdminCicloGrid";

const buildInitialCicloFormData = selectedFamiliaForCiclos => ({
    id_familia: selectedFamiliaForCiclos ? String(selectedFamiliaForCiclos.id_familia) : "",
    nombre: "",
    nivel: "GS",
    descripcion: "",
    duracion_horas: ""
});

function AdminCiclosPanel({ selectedFamiliaForCiclos, onBackToFamilias }) {
    const [ciclos, setCiclos] = useState([]);
    const [isLoadingCiclos, setIsLoadingCiclos] = useState(true);
    const [ciclosError, setCiclosError] = useState("");
    const [cicloFormData, setCicloFormData] = useState(
        buildInitialCicloFormData(selectedFamiliaForCiclos)
    );
    const [isCreatingCiclo, setIsCreatingCiclo] = useState(false);
    const [isUpdatingCiclo, setIsUpdatingCiclo] = useState(false);
    const [isDeletingCiclo, setIsDeletingCiclo] = useState(false);
    const [cicloFormError, setCicloFormError] = useState("");
    const [cicloFormSuccess, setCicloFormSuccess] = useState("");
    const [editingCiclo, setEditingCiclo] = useState(null);
    const [cicloMenuAnchorEl, setCicloMenuAnchorEl] = useState(null);
    const [selectedCicloForMenu, setSelectedCicloForMenu] = useState(null);
    const [idCicloHighlight, setIdCicloHighlight] = useState(null);

    const cicloFormRef = useRef(null);

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
        loadCiclos();
    }, [loadCiclos]);

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

    const scrollToCicloForm = () => {
        setTimeout(() => {
            cicloFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 0);
    };

    const handleCicloFormChange = event => {
        const { name, value } = event.target;

        setCicloFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenCicloMenu = (event, ciclo) => {
        setCicloMenuAnchorEl(event.currentTarget);
        setSelectedCicloForMenu(ciclo);
    };

    const handleCloseCicloMenu = () => {
        setCicloMenuAnchorEl(null);
        setSelectedCicloForMenu(null);
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

    const handleDeleteCiclo = async () => {
        if (!selectedCicloForMenu) {
            return;
        }

        const confirmed = window.confirm(
            `¿Seguro que quieres eliminar el ciclo "${selectedCicloForMenu.nombre}"?`
        );

        if (!confirmed) {
            return;
        }

        setCicloFormError("");
        setCicloFormSuccess("");
        setIsDeletingCiclo(true);

        try {
            await deleteAdminCiclo(selectedCicloForMenu.id_ciclo);
            handleCloseCicloMenu();
            setCicloFormSuccess("Ciclo formativo eliminado correctamente");
            scrollToCicloForm();

            setIsLoadingCiclos(true);
            await loadCiclos();
        } catch (error) {
            setCicloFormError(
                error?.response?.data?.mensaje || "No se pudo eliminar el ciclo formativo"
            );
            scrollToCicloForm();
        } finally {
            setIsDeletingCiclo(false);
        }
    };

    const scrollToCicloCard = idCiclo => {
        const cicloCard = document.getElementById(`ciclo-card-${idCiclo}`);

        cicloCard?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };

    const handleCancelEditCiclo = () => {
        const cicloId = editingCiclo?.id_ciclo || null;

        setEditingCiclo(null);
        setCicloFormData(buildInitialCicloFormData(selectedFamiliaForCiclos));
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
                scrollToCicloForm();
                setEditingCiclo(null);
                setCicloFormData(buildInitialCicloFormData(selectedFamiliaForCiclos));

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
                scrollToCicloForm();
            } finally {
                setIsUpdatingCiclo(false);
            }

            return;
        }

        setIsCreatingCiclo(true);

        try {
            await createAdminCiclo(cicloFormData);
            setCicloFormData(buildInitialCicloFormData(selectedFamiliaForCiclos));
            setCicloFormSuccess("Ciclo formativo creado correctamente");
            scrollToCicloForm();
            setIsLoadingCiclos(true);
            await loadCiclos();
        } catch (error) {
            setCicloFormError(error?.response?.data?.mensaje || "No se pudo crear el ciclo formativo");
            scrollToCicloForm();
        } finally {
            setIsCreatingCiclo(false);
        }
    };

    return (
        <>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
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
                    onClick={onBackToFamilias}
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
                onDeleteCiclo={handleDeleteCiclo}
                idCicloHighlight={idCicloHighlight}
            />
        </>
    );
}

export default AdminCiclosPanel;
