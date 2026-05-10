import {
	Alert,
	Box,
	Button,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

export default function AdminFamilyForm({
	editingFamily,
	familyFormData,
	familyFormError,
	familyFormSuccess,
	isCreatingFamily,
	isUpdatingFamily,
	onChange,
	onSubmit,
	onCancelEdit,
	formRef,
}) {
	return (
		<Paper
			ref={formRef}
			elevation={0}
			sx={{
				p: 3,
				borderRadius: 3,
				border: "1px solid #dbe2f0",
				backgroundColor: "#ffffff",
			}}>
			<Stack spacing={2.5}>
				{/* Cambia el titulo segun el formulario este en modo alta o en modo edicion. */}
				<Typography variant='h6' sx={{ fontWeight: 700 }}>
					{editingFamily
						? "Editar familia profesional"
						: "Nueva familia profesional"}
				</Typography>

				{/* Muestra el error del formulario si el backend devuelve algun problema. */}
				{familyFormError ? (
					<Alert severity='error'>{familyFormError}</Alert>
				) : null}

				{/* Muestra un mensaje de exito tras crear o actualizar una familia. */}
				{familyFormSuccess ? (
					<Alert severity='success'>{familyFormSuccess}</Alert>
				) : null}

				{/* Este mismo formulario sirve tanto para crear como para editar. */}
				<Box component='form' onSubmit={onSubmit}>
					<Stack spacing={2}>
						<TextField
							label='Nombre de la familia'
							name='nombre'
							value={familyFormData.nombre}
							onChange={onChange}
							required
							fullWidth
						/>

						<TextField
							label='Descripcion'
							name='descripcion'
							value={familyFormData.descripcion}
							onChange={onChange}
							multiline
							minRows={3}
							fullWidth
						/>

						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={1.5}>
							<Button
								type='submit'
								variant='contained'
								disabled={isCreatingFamily || isUpdatingFamily}
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
										boxShadow: "none",
									},
								}}>
								{editingFamily
									? isUpdatingFamily
										? "Guardando cambios..."
										: "Guardar cambios"
									: isCreatingFamily
										? "Guardando..."
										: "Crear familia"}
							</Button>

							{/* Solo aparece cuando estamos editando una familia existente. */}
							{editingFamily ? (
								<Button
									type='button'
									variant='outlined'
									onClick={onCancelEdit}
									disabled={isUpdatingFamily}
									sx={{
										alignSelf: "flex-start",
										textTransform: "none",
										fontWeight: 600,
										borderRadius: 999,
										px: 3,
									}}>
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
