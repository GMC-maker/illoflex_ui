import AdminFamilyForm from "./AdminFamilyForm";
import AdminFamiliaGrid from "./AdminFamiliaGrid";

function AdminFamiliasPanel({
	familiaFormRef,
	editFamilia,
	familiaFormData,
	familiaFormError,
	familiaFormSuccess,
	isCreatingFamilia,
	isUpdatingFamilia,
	handleFamiliaFormChange,
	handleSubmitFamiliaForm,
	handleCancelEditFamilia,
	familias,
	isLoadingFamilias,
	familiasError,
	familiaMenuAnchorEl,
	selectedFamiliaForMenu,
	handleOpenFamiliaMenu,
	handleCloseFamiliaMenu,
	handleStartEditFamilia,
	handleViewFamiliaCiclos,
	idFamiliaHighlight
}) {
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
	);
}

export default AdminFamiliasPanel;
