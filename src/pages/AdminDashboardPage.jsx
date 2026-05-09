import { useState } from "react";
import {
	Alert,
	Box,
	Button,
	Container,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminAuthService";

export default function AdminDashboardPage({ admin }) {
	// Controla si el cierre de sesion se esta enviando al backend.
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Guarda un error si falla el logout.
	const [errorMessage, setErrorMessage] = useState("");

	const navigate = useNavigate();

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

								<Typography
									variant='h4'
									sx={{ fontWeight: 700 }}>
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
								<Typography
									variant='h6'
									sx={{ fontWeight: 700 }}>
									Estado del area admin
								</Typography>

								<Typography sx={{ color: "#475569" }}>
									El acceso admin ya funciona correctamente.
									El siguiente paso sera conectar aqui el CRUD
									minimo de familias profesionales.
								</Typography>
							</Stack>
						</Paper>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
