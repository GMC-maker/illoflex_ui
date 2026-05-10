import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";
import { createAdminFamily, getAdminFamilies, updateAdminFamily } from "../services/adminFamiliaService";
import AdminFamilyForm from "../components/admin/AdminFamilyForm";
import AdminFamilyGrid from "../components/admin/AdminFamilyGrid";

export default function AdminDashboardPage({ admin }) {
	// Controla si el cierre de sesion se esta enviando al backend.
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Guarda un error general, por ejemplo si falla el logout.
	const [errorMessage, setErrorMessage] = useState("");

	// Guarda el listado de familias recuperado desde backend.
	const [families, setFamilies] = useState([]);

	// Controla el estado de carga del listado de familias.
	const [isLoadingFamilies, setIsLoadingFamilies] = useState(true);

	// Guarda un posible error al cargar familias.
	const [familiesError, setFamiliesError] = useState("");

	// Guarda los valores del formulario para crear o editar una familia.
	const [familyFormData, setFamilyFormData] = useState({
		nombre: "",
		descripcion: "",
	});

	// Indica si el formulario esta creando una familia nueva.
	const [isCreatingFamily, setIsCreatingFamily] = useState(false);

	// Indica si el formulario esta guardando una edicion.
	const [isUpdatingFamily, setIsUpdatingFamily] = useState(false);

	// Guarda el error del formulario si algo falla.
	const [familyFormError, setFamilyFormError] = useState("");

	// Guarda un mensaje de exito cuando el alta o la edicion salen bien.
	const [familyFormSuccess, setFamilyFormSuccess] = useState("");

	// Guarda la familia que se esta editando. Si es null, el formulario esta en modo alta.
	const [editingFamily, setEditingFamily] = useState(null);

	// Guarda el elemento HTML del boton engranaje para abrir/cerrar el menu.
	const [familyMenuAnchorEl, setFamilyMenuAnchorEl] = useState(null);

	// Guarda la familia asociada al menu abierto para saber sobre cual actuar.
	const [selectedFamilyForMenu, setSelectedFamilyForMenu] = useState(null);

	// Referencia al formulario para mover la vista cuando entramos en modo edicion.
	const familyFormRef = useRef(null);

	const navigate = useNavigate();

	// Carga las familias profesionales desde backend.
	const loadFamilies = useCallback(async () => {
		try {
			const familiesData = await getAdminFamilies();
			setFamilies(familiesData);
			setFamiliesError("");
		} catch (error) {
			setFamilies([]);
			setFamiliesError(
				error?.response?.data?.mensaje ||
					"No se pudieron cargar las familias profesionales",
			);
		} finally {
			setIsLoadingFamilies(false);
		}
	}, []);

	// Al entrar en el panel admin, recupera el listado inicial.
	useEffect(() => {
		loadFamilies();
	}, [loadFamilies]);

	// Cuando se activa el modo edicion, espera al render y luego mueve la vista al formulario.
	useEffect(() => {
		if (!editingFamily) {
			return;
		}

		const timeoutId = setTimeout(() => {
			scrollToEdit();
		}, 50);

		return () => clearTimeout(timeoutId);
	}, [editingFamily]);

	// Cierra la sesion del admin y redirige al login.
	const handleLogout = async () => {
		setErrorMessage("");
		setIsLoggingOut(true);

		try {
			await logoutAdmin();
			navigate("/admin/login", { replace: true });
		} catch (error) {
			setErrorMessage(
				error?.response?.data?.mensaje ||
					"No se pudo cerrar la sesion de administrador",
			);
		} finally {
			setIsLoggingOut(false);
		}
	};

	// Actualiza el campo correspondiente del formulario.
	const handleFamilyFormChange = (event) => {
		const { name, value } = event.target;

		setFamilyFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Abre el menu del engranaje de una tarjeta concreta.
	const handleOpenFamilyMenu = (event, family) => {
		setFamilyMenuAnchorEl(event.currentTarget);
		setSelectedFamilyForMenu(family);
	};

	// Cierra el menu del engranaje.
	const handleCloseFamilyMenu = () => {
		setFamilyMenuAnchorEl(null);
		setSelectedFamilyForMenu(null);
	};

	// Lleva la vista hasta el formulario cuando se activa la edicion.
	const scrollToEdit = () => {
		familyFormRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	// Lleva la vista hasta la tarjeta de una familia concreta.
	const scrollToFamilyCard = (idFamilia) => {
		const familyCard = document.getElementById(`family-card-${idFamilia}`);

		familyCard?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	};

	// Activa el modo edicion cargando la familia seleccionada en el formulario.
	const handleStartEditFamily = () => {
		if (!selectedFamilyForMenu) {
			return;
		}

		setEditingFamily(selectedFamilyForMenu);
		setFamilyFormData({
			nombre: selectedFamilyForMenu.nombre,
			descripcion: selectedFamilyForMenu.descripcion || "",
		});
		setFamilyFormError("");
		setFamilyFormSuccess("");
		handleCloseFamilyMenu();
	};

	// Cancela la edicion y devuelve el formulario al modo alta.
	const handleCancelEditFamily = () => {
		const familyId = editingFamily?.id_familia || null;

		setEditingFamily(null);
		setFamilyFormData({
			nombre: "",
			descripcion: "",
		});
		setFamilyFormError("");
		setFamilyFormSuccess("");

		// Al cancelar, vuelve a la tarjeta que estaba editando.
		if (familyId) {
			setTimeout(() => {
				scrollToFamilyCard(familyId);
			}, 0);
		}
	};

	// Envia el formulario para crear una nueva familia o actualizar una existente.
	const handleSubmitFamilyForm = async (event) => {
		event.preventDefault();
		setFamilyFormError("");
		setFamilyFormSuccess("");

		if (editingFamily) {
			const familyId = editingFamily.id_familia;
			setIsUpdatingFamily(true);

			try {
				await updateAdminFamily(familyId, familyFormData);

				setFamilyFormSuccess("Familia profesional actualizada correctamente");

				setEditingFamily(null);
				setFamilyFormData({
					nombre: "",
					descripcion: "",
				});

				setIsLoadingFamilies(true);
				await loadFamilies();

				// Tras guardar, vuelve a la tarjeta actualizada.
				setTimeout(() => {
					scrollToFamilyCard(familyId);
				}, 0);
			} catch (error) {
				setFamilyFormError(
					error?.response?.data?.mensaje ||
						"No se pudo actualizar la familia profesional",
				);
			} finally {
				setIsUpdatingFamily(false);
			}

			return;
		}

		setIsCreatingFamily(true);

		try {
			await createAdminFamily(familyFormData);

			// Limpia el formulario tras un alta correcta.
			setFamilyFormData({
				nombre: "",
				descripcion: "",
			});

			setFamilyFormSuccess("Familia profesional creada correctamente");

			// Recarga el listado para mostrar la nueva familia.
			setIsLoadingFamilies(true);
			await loadFamilies();
		} catch (error) {
			setFamilyFormError(
				error?.response?.data?.mensaje ||
					"No se pudo crear la familia profesional",
			);
		} finally {
			setIsCreatingFamily(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background:
					"linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f6f7fb 100%)",
				py: 8,
			}}>
			<Container maxWidth='lg'>
				<Paper
					elevation={0}
					sx={{
						p: { xs: 4, md: 5 },
						borderRadius: 4,
						border: "1px solid #dbe2f0",
						backgroundColor: "rgba(255, 255, 255, 0.96)",
					}}>
					<Stack spacing={3}>
						<Stack
							direction={{ xs: "column", sm: "row" }}
							justifyContent='space-between'
							alignItems={{ xs: "flex-start", sm: "center" }}
							spacing={2}>
							<Stack spacing={1}>
								<Typography
									variant='overline'
									sx={{
										color: "#1d4ed8",
										fontWeight: 700,
										letterSpacing: "0.08em",
									}}>
									Area interna
								</Typography>

								<Typography variant='h4' sx={{ fontWeight: 700 }}>
									Panel de administracion
								</Typography>

								<Typography sx={{ color: "#475569" }}>
									Sesion iniciada como {admin.email}.
								</Typography>
							</Stack>

							<Button
								variant='outlined'
								onClick={handleLogout}
								disabled={isLoggingOut}
								sx={{
									textTransform: "none",
									fontWeight: 600,
									borderRadius: 999,
									px: 2.5,
								}}>
								{isLoggingOut ? "Cerrando sesion..." : "Cerrar sesion"}
							</Button>
						</Stack>

						{errorMessage ? <Alert severity='error'>{errorMessage}</Alert> : null}

						<Paper
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 3,
								border: "1px solid #dbe2f0",
								backgroundColor: "#f8fbff",
							}}>
							<Stack spacing={1.5}>
								<Typography variant='h6' sx={{ fontWeight: 700 }}>
									Estado del area admin
								</Typography>

								<Typography sx={{ color: "#475569" }}>
									El acceso admin ya funciona correctamente. Ahora el panel ya
									esta conectado con el listado de familias profesionales.
								</Typography>
							</Stack>
						</Paper>

						<AdminFamilyForm
							formRef={familyFormRef}
							editingFamily={editingFamily}
							familyFormData={familyFormData}
							familyFormError={familyFormError}
							familyFormSuccess={familyFormSuccess}
							isCreatingFamily={isCreatingFamily}
							isUpdatingFamily={isUpdatingFamily}
							onChange={handleFamilyFormChange}
							onSubmit={handleSubmitFamilyForm}
							onCancelEdit={handleCancelEditFamily}
						/>

						<AdminFamilyGrid
							families={families}
							isLoadingFamilies={isLoadingFamilies}
							familiesError={familiesError}
							familyMenuAnchorEl={familyMenuAnchorEl}
							selectedFamilyForMenu={selectedFamilyForMenu}
							onOpenFamilyMenu={handleOpenFamilyMenu}
							onCloseFamilyMenu={handleCloseFamilyMenu}
							onStartEditFamily={handleStartEditFamily}
						/>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
