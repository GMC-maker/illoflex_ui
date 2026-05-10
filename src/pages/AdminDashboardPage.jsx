import { useCallback, useEffect, useState } from "react";
import {
	Alert,
	Box,
	Button,
	Container,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";
import {
	createAdminFamily,
	getAdminFamilies,
} from "../services/adminFamiliaService";

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

	// Guarda los valores del formulario para crear una familia nueva.
	const [newFamilyData, setNewFamilyData] = useState({
		nombre: "",
		descripcion: "",
	});

	// Controla si el formulario de alta se esta enviando.
	const [isCreatingFamily, setIsCreatingFamily] = useState(false);

	// Guarda el error del alta de familia si algo falla.
	const [createFamilyError, setCreateFamilyError] = useState("");

	// Guarda un mensaje de exito cuando la familia se crea correctamente.
	const [createFamilySuccess, setCreateFamilySuccess] = useState("");

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

	// Actualiza el campo correspondiente del formulario de alta.
	const handleNewFamilyChange = (event) => {
		const { name, value } = event.target;

		setNewFamilyData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Envia el formulario para crear una nueva familia.
	const handleCreateFamily = async (event) => {
		event.preventDefault();
		setCreateFamilyError("");
		setCreateFamilySuccess("");
		setIsCreatingFamily(true);

		try {
			await createAdminFamily(newFamilyData);

			// Limpia el formulario tras un alta correcta.
			setNewFamilyData({
				nombre: "",
				descripcion: "",
			});

			setCreateFamilySuccess("Familia profesional creada correctamente");

			// Recarga el listado para mostrar la nueva familia.
			setIsLoadingFamilies(true);
			await loadFamilies();
		} catch (error) {
			setCreateFamilyError(
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
								{isLoggingOut
									? "Cerrando sesion..."
									: "Cerrar sesion"}
							</Button>
						</Stack>

						{errorMessage ? (
							<Alert severity='error'>{errorMessage}</Alert>
						) : null}

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
									El acceso admin ya funciona correctamente.
									Ahora el panel ya esta conectado con el
									listado de familias profesionales.
								</Typography>
							</Stack>
						</Paper>

						<Paper
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 3,
								border: "1px solid #dbe2f0",
								backgroundColor: "#ffffff",
							}}>
							<Stack spacing={2.5}>
								<Typography variant='h6' sx={{ fontWeight: 700 }}>
									Nueva familia profesional
								</Typography>

								{createFamilyError ? (
									<Alert severity='error'>
										{createFamilyError}
									</Alert>
								) : null}

								{createFamilySuccess ? (
									<Alert severity='success'>
										{createFamilySuccess}
									</Alert>
								) : null}

								<Box component='form' onSubmit={handleCreateFamily}>
									<Stack spacing={2}>
										<TextField
											label='Nombre de la familia'
											name='nombre'
											value={newFamilyData.nombre}
											onChange={handleNewFamilyChange}
											required
											fullWidth
										/>

										<TextField
											label='Descripcion'
											name='descripcion'
											value={newFamilyData.descripcion}
											onChange={handleNewFamilyChange}
											multiline
											minRows={3}
											fullWidth
										/>

										<Button
											type='submit'
											variant='contained'
											disabled={isCreatingFamily}
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
											{isCreatingFamily
												? "Guardando..."
												: "Crear familia"}
										</Button>
									</Stack>
								</Box>
							</Stack>
						</Paper>

						<Paper
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 3,
								border: "1px solid #dbe2f0",
								backgroundColor: "#ffffff",
							}}>
							<Stack spacing={2}>
								<Typography variant='h6' sx={{ fontWeight: 700 }}>
									Familias profesionales
								</Typography>

								{isLoadingFamilies ? (
									<Typography sx={{ color: "#475569" }}>
										Cargando familias...
									</Typography>
								) : null}

								{familiesError ? (
									<Alert severity='error'>{familiesError}</Alert>
								) : null}

								{!isLoadingFamilies &&
								!familiesError &&
								families.length === 0 ? (
									<Alert severity='info'>
										No hay familias profesionales cargadas.
									</Alert>
								) : null}

								{!isLoadingFamilies && !familiesError ? (
									<Box
										sx={{
											display: "grid",
											gridTemplateColumns: {
												xs: "1fr",
												sm: "repeat(2, 1fr)",
												lg: "repeat(3, 1fr)",
											},
											gap: 2,
										}}>
										{families.map((family) => (
											<Box
												key={family.id_familia}
												sx={{
													p: 2,
													borderRadius: 2.5,
													border: "1px solid #dbe2f0",
													backgroundColor: "#f8fbff",
													height: "100%",
												}}>
												<Stack spacing={0.75}>
													<Typography
														variant='body1'
														sx={{
															fontWeight: 700,
															color: "#1f2937",
														}}>
														{family.nombre}
													</Typography>

													<Typography
														variant='body2'
														sx={{ color: "#475569" }}>
														{family.descripcion ||
															"Sin descripcion"}
													</Typography>
												</Stack>
											</Box>
										))}
									</Box>
								) : null}
							</Stack>
						</Paper>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
