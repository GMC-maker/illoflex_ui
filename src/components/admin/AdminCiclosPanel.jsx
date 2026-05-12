import AdminCicloForm from "./AdminCicloForm";
import AdminCicloGrid from "./AdminCicloGrid";

function AdminCiclosPanel({
    cicloFormRef,
    editingCiclo,
    cicloFormData,
    cicloFormError,
    cicloFormSuccess,
    isCreatingCiclo,
    isUpdatingCiclo,
    selectedFamiliaForCiclos,
    ciclos,
    isLoadingCiclos,
    ciclosError,
    cicloMenuAnchorEl,
    handleCicloFormChange,
    handleSubmitCicloForm,
    handleCancelEditCiclo,
    handleOpenCicloMenu,
    handleCloseCicloMenu,
    handleStartEditCiclo,
    idCicloHighlight
}) {
    return (
        <>
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
    );
}

export default AdminCiclosPanel;
