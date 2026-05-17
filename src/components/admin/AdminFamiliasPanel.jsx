import { useCallback, useEffect, useRef, useState } from "react";
import {
    createAdminFamily,
    getAdminFamilies,
    updateAdminFamily,
    deleteAdminFamily
} from "../../services/adminFamiliaService";
import { getAdminCiclos } from "../../services/adminCicloService";
import AdminFamilyForm from "./AdminFamilyForm";
import AdminFamiliaGrid from "./AdminFamiliaGrid";

function AdminFamiliasPanel({ onViewFamiliaCiclos }) {
    const [familias, setFamilias] = useState([]);
    const [ciclos, setCiclos] = useState([]);
    const [isLoadingFamilias, setIsLoadingFamilias] = useState(true);
    const [familiasError, setFamiliasError] = useState("");
    const [familiaFormData, setFamiliaFormData] = useState({
        nombre: "",
        descripcion: ""
    });
    const [isCreatingFamilia, setIsCreatingFamilia] = useState(false);
    const [isUpdatingFamilia, setIsUpdatingFamilia] = useState(false);
    const [isDeletingFamilia, setIsDeletingFamilia] = useState(false);
    const [familiaFormError, setFamiliaFormError] = useState("");
    const [familiaFormSuccess, setFamiliaFormSuccess] = useState("");
    const [editFamilia, setEditFamilia] = useState(null);
    const [familiaMenuAnchorEl, setFamiliaMenuAnchorEl] = useState(null);
    const [selectedFamiliaForMenu, setSelectedFamiliaForMenu] = useState(null);
    const [idFamiliaHighlight, setIdFamiliaHighlight] = useState(null);

    const familiaFormRef = useRef(null);

    const loadFamilias = useCallback(async () => {
        try {
            const [familiasData, ciclosData] = await Promise.all([getAdminFamilies(), getAdminCiclos()]);

            setFamilias(familiasData);
            setCiclos(ciclosData);
            setFamiliasError("");
        } catch (error) {
            setFamilias([]);
            setCiclos([]);
            setFamiliasError(
                error?.response?.data?.mensaje || "No se pudieron cargar las familias profesionales"
            );
        } finally {
            setIsLoadingFamilias(false);
        }
    }, []);

    useEffect(() => {
        loadFamilias();
    }, [loadFamilias]);

    useEffect(() => {
        if (!editFamilia) {
            return;
        }

        const timeoutId = setTimeout(() => {
            familiaFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [editFamilia]);

    const scrollToFamiliaForm = () => {
        setTimeout(() => {
            familiaFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 0);
    };

    const handleFamiliaFormChange = event => {
        const { name, value } = event.target;

        setFamiliaFormData(prev => ({
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

    const handleDeleteFamilia = async () => {
        if (!selectedFamiliaForMenu) {
            return;
        }

        const confirmed = window.confirm(
            `¿Seguro que quieres eliminar la familia "${selectedFamiliaForMenu.nombre}"?`
        );

        if (!confirmed) {
            return;
        }

        setFamiliaFormError("");
        setFamiliaFormSuccess("");
        setIsDeletingFamilia(true);

        try {
            await deleteAdminFamily(selectedFamiliaForMenu.id_familia);
            handleCloseFamiliaMenu();
            setFamiliaFormSuccess("Familia profesional eliminada correctamente");
            scrollToFamiliaForm();

            setIsLoadingFamilias(true);
            await loadFamilias();
        } catch (error) {
            setFamiliaFormError(
                error?.response?.data?.mensaje || "No se pudo eliminar la familia profesional"
            );
            scrollToFamiliaForm();
        } finally {
            setIsDeletingFamilia(false);
        }
    };

    const scrollToFamiliaCard = idFamilia => {
        const familyCard = document.getElementById(`family-card-${idFamilia}`);

        familyCard?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
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
                scrollToFamiliaCard(familyId);
            }, 0);

            setTimeout(() => {
                setIdFamiliaHighlight(null);
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
                scrollToFamiliaForm();
                setEditFamilia(null);
                setFamiliaFormData({
                    nombre: "",
                    descripcion: ""
                });

                setIsLoadingFamilias(true);
                await loadFamilias();

                setIdFamiliaHighlight(familyId);

                setTimeout(() => {
                    scrollToFamiliaCard(familyId);
                }, 0);

                setTimeout(() => {
                    setIdFamiliaHighlight(null);
                }, 1800);
            } catch (error) {
                setFamiliaFormError(
                    error?.response?.data?.mensaje || "No se pudo actualizar la familia profesional"
                );
                scrollToFamiliaForm();
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
            scrollToFamiliaForm();
            setIsLoadingFamilias(true);
            await loadFamilias();
        } catch (error) {
            setFamiliaFormError(
                error?.response?.data?.mensaje || "No se pudo crear la familia profesional"
            );
            scrollToFamiliaForm();
        } finally {
            setIsCreatingFamilia(false);
        }
    };

    return (
        <>
            <AdminFamilyForm
                formRef={familiaFormRef}
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
                ciclos={ciclos}
                isLoadingFamilies={isLoadingFamilias}
                familiesError={familiasError}
                familyMenuAnchorEl={familiaMenuAnchorEl}
                selectedFamilyForMenu={selectedFamiliaForMenu}
                onOpenFamilyMenu={handleOpenFamiliaMenu}
                onCloseFamilyMenu={handleCloseFamiliaMenu}
                onStartEditFamily={handleStartEditFamilia}
                onDeleteFamily={handleDeleteFamilia}
                isDeletingFamily={isDeletingFamilia}
                onViewFamilyCiclos={onViewFamiliaCiclos}
                idFamiliaHighlight={idFamiliaHighlight}
            />
        </>
    );
}

export default AdminFamiliasPanel;
