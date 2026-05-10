import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Box,Button,Container,Paper,Stack,Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";
import {createAdminCiclo,getAdminCiclos,updateAdminCiclo,
} from "../services/adminCicloService";
import {createAdminFamily,getAdminFamilies,updateAdminFamily,
} from "../services/adminFamiliaService";
import AdminCicloForm from "../components/admin/AdminCicloForm";
import AdminCicloGrid from "../components/admin/AdminCicloGrid";
import AdminFamilyForm from "../components/admin/AdminFamilyForm";
import AdminFamilyGrid from "../components/admin/AdminFamilyGrid";

export default function AdminDashboardPage({ admin }) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [families, setFamilies] = useState([]);
	const [isLoadingFamilies, setIsLoadingFamilies] = useState(true);
	const [familiesError, setFamiliesError] = useState("");

	const [familyFormData, setFamilyFormData] = useState({
		nombre: "",
		descripcion: "",
	});
	const [isCreatingFamily, setIsCreatingFamily] = useState(false);
	const [isUpdatingFamily, setIsUpdatingFamily] = useState(false);
	const [familyFormError, setFamilyFormError] = useState("");
	const [familyFormSuccess, setFamilyFormSuccess] = useState("");
	const [editingFamily, setEditingFamily] = useState(null);
	const [familyMenuAnchorEl, setFamilyMenuAnchorEl] = useState(null);
	const [selectedFamilyForMenu, setSelectedFamilyForMenu] = useState(null);

	const [selectedFamilyForCiclos, setSelectedFamilyForCiclos] = useState(null);

	const [ciclos, setCiclos] = useState([]);
	const [isLoadingCiclos, setIsLoadingCiclos] = useState(true);
	const [ciclosError, setCiclosError] = useState("");

	const [cicloFormData, setCicloFormData] = useState({
		id_familia: "",
		nombre: "",
		nivel: "GS",
		descripcion: "",
		duracion_horas: "",
	});
	const [isCreatingCiclo, setIsCreatingCiclo] = useState(false);
	const [isUpdatingCiclo, setIsUpdatingCiclo] = useState(false);
	const [cicloFormError, setCicloFormError] = useState("");
	const [cicloFormSuccess, setCicloFormSuccess] = useState("");
	const [editingCiclo, setEditingCiclo] = useState(null);
	const [cicloMenuAnchorEl, setCicloMenuAnchorEl] = useState(null);
	const [selectedCicloForMenu, setSelectedCicloForMenu] = useState(null);

	const familyFormRef = useRef(null);
	const cicloFormRef = useRef(null);

	const navigate = useNavigate();

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

	const loadCiclos = useCallback(async () => {
		try {
			const ciclosData = await getAdminCiclos();
			setCiclos(ciclosData);
			setCiclosError("");
		} catch (error) {
			setCiclos([]);
			setCiclosError(
				error?.response?.data?.mensaje ||
					"No se pudieron cargar los ciclos formativos",
			);
		} finally {
			setIsLoadingCiclos(false);
		}
	}, []);

	useEffect(() => {
		loadFamilies();
		loadCiclos();
	}, [loadFamilies, loadCiclos]);

	useEffect(() => {
		if (!editingFamily) {
			return;
		}

		const timeoutId = setTimeout(() => {
			familyFormRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 50);

		return () => clearTimeout(timeoutId);
	}, [editingFamily]);

	useEffect(() => {
		if (!editingCiclo) {
			return;
		}

		const timeoutId = setTimeout(() => {
			cicloFormRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
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
				error?.response?.data?.mensaje ||
					"No se pudo cerrar la sesion de administrador",
			);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const handleFamilyFormChange = (event) => {
		const { name, value } = event.target;

		setFamilyFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCicloFormChange = (event) => {
		const { name, value } = event.target;

		setCicloFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleOpenFamilyMenu = (event, family) => {
		setFamilyMenuAnchorEl(event.currentTarget);
		setSelectedFamilyForMenu(family);
	};

	const handleCloseFamilyMenu = () => {
		setFamilyMenuAnchorEl(null);
		setSelectedFamilyForMenu(null);
	};

	const handleOpenCicloMenu = (event, ciclo) => {
		setCicloMenuAnchorEl(event.currentTarget);
		setSelectedCicloForMenu(ciclo);
	};

	const handleCloseCicloMenu = () => {
		setCicloMenuAnchorEl(null);
		setSelectedCicloForMenu(null);
	};

	const scrollToFamilyCard = (idFamilia) => {
		const familyCard = document.getElementById(`family-card-${idFamilia}`);

		familyCard?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	};

	const scrollToCicloCard = (idCiclo) => {
		const cicloCard = document.getElementById(`ciclo-card-${idCiclo}`);

		cicloCard?.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	};

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

	const handleViewFamilyCiclos = (family) => {
		setSelectedFamilyForCiclos(family);
		setEditingCiclo(null);
		setCicloFormError("");
		setCicloFormSuccess("");
		setCicloFormData({
			id_familia: String(family.id_familia),
			nombre: "",
			nivel: "GS",
			descripcion: "",
			duracion_horas: "",
		});
	};

	const handleBackToFamilies = () => {
		setSelectedFamilyForCiclos(null);
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
				: "",
		});
		setCicloFormError("");
		setCicloFormSuccess("");
		handleCloseCicloMenu();
	};

	const handleCancelEditFamily = () => {
		const familyId = editingFamily?.id_familia || null;

		setEditingFamily(null);
		setFamilyFormData({
			nombre: "",
			descripcion: "",
		});
		setFamilyFormError("");
		setFamilyFormSuccess("");

		if (familyId) {
			setTimeout(() => {
				scrollToFamilyCard(familyId);
			}, 0);
		}
	};

	const handleCancelEditCiclo = () => {
		const cicloId = editingCiclo?.id_ciclo || null;

		setEditingCiclo(null);
		setCicloFormData({
			id_familia: selectedFamilyForCiclos
				? String(selectedFamilyForCiclos.id_familia)
				: "",
			nombre: "",
			nivel: "GS",
			descripcion: "",
			duracion_horas: "",
		});
		setCicloFormError("");
		setCicloFormSuccess("");

		if (cicloId) {
			setTimeout(() => {
				scrollToCicloCard(cicloId);
			}, 0);
		}
	};

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
			setFamilyFormData({
				nombre: "",
				descripcion: "",
			});
			setFamilyFormSuccess("Familia profesional creada correctamente");
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

	const handleSubmitCicloForm = async (event) => {
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
					id_familia: selectedFamilyForCiclos
						? String(selectedFamilyForCiclos.id_familia)
						: "",
					nombre: "",
					nivel: "GS",
					descripcion: "",
					duracion_horas: "",
				});

				setIsLoadingCiclos(true);
				await loadCiclos();

				setTimeout(() => {
					scrollToCicloCard(cicloId);
				}, 0);
			} catch (error) {
				setCicloFormError(
					error?.response?.data?.mensaje ||
						"No se pudo actualizar el ciclo formativo",
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
				id_familia: selectedFamilyForCiclos
					? String(selectedFamilyForCiclos.id_familia)
					: "",
				nombre: "",
				nivel: "GS",
				descripcion: "",
				duracion_horas: "",
			});

			setCicloFormSuccess("Ciclo formativo creado correctamente");
			setIsLoadingCiclos(true);
			await loadCiclos();
		} catch (error) {
			setCicloFormError(
				error?.response?.data?.mensaje ||
					"No se pudo crear el ciclo formativo",
			);
		} finally {
			setIsCreatingCiclo(false);
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
									{selectedFamilyForCiclos
										? `Gestionando ciclos de ${selectedFamilyForCiclos.nombre}.`
										: "El acceso admin ya funciona correctamente. Ahora el panel ya esta conectado con el listado de familias profesionales."}
								</Typography>
							</Stack>
						</Paper>

						{!selectedFamilyForCiclos ? (
							<>
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
									onViewFamilyCiclos={handleViewFamilyCiclos}
								/>
							</>
						) : (
							<>
								<Stack
									direction={{ xs: "column", sm: "row" }}
									justifyContent='space-between'
									alignItems={{ xs: "flex-start", sm: "center" }}
									spacing={2}>
									<Stack spacing={1}>
										<Typography variant='h5' sx={{ fontWeight: 700 }}>
											Ciclos formativos
										</Typography>

										<Typography sx={{ color: "#475569" }}>
											Familia actual: {selectedFamilyForCiclos.nombre}
										</Typography>
									</Stack>

									<Button
										type='button'
										variant='outlined'
										onClick={handleBackToFamilies}
										sx={{
											textTransform: "none",
											fontWeight: 600,
											borderRadius: 999,
											px: 2.5,
										}}>
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
									families={[selectedFamilyForCiclos]}
									onChange={handleCicloFormChange}
									onSubmit={handleSubmitCicloForm}
									onCancelEdit={handleCancelEditCiclo}
								/>

								<AdminCicloGrid
									selectedFamilyForCiclos={selectedFamilyForCiclos}
									ciclos={ciclos}
									isLoadingCiclos={isLoadingCiclos}
									ciclosError={ciclosError}
									cicloMenuAnchorEl={cicloMenuAnchorEl}
									onOpenCicloMenu={handleOpenCicloMenu}
									onCloseCicloMenu={handleCloseCicloMenu}
									onStartEditCiclo={handleStartEditCiclo}
								/>
							</>
						)}
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
