import { useState } from "react";
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
import { loginAdmin } from "../services/adminAuthService";

export default function AdminLoginPage() {
	// Guarda los valores del formulario de login.
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// Controla si la peticion de login esta en curso.
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Guarda un mensaje de error si el login falla.
	const [errorMessage, setErrorMessage] = useState("");

	const navigate = useNavigate();

	// Actualiza el campo correspondiente cuando el usuario escribe.
	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Envia el formulario al backend para iniciar sesion admin.
	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setIsSubmitting(true);

		try {
			await loginAdmin(formData);

			// Si el login va bien, redirige al panel admin protegido.
			navigate("/admin", { replace: true });
		} catch (error) {
			// Intenta mostrar el mensaje devuelto por el backend.
			setErrorMessage(
				error?.response?.data?.mensaje ||
					"No se pudo iniciar sesion como administrador",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				background:
					"linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f6f7fb 100%)",
				py: 8,
			}}>
			<Container maxWidth='sm'>
				<Paper
					elevation={0}
					sx={{
						p: { xs: 4, md: 5 },
						borderRadius: 4,
						border: "1px solid #dbe2f0",
						backgroundColor: "rgba(255, 255, 255, 0.96)",
					}}>
					<Stack spacing={3}>
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
								Acceso de administracion
							</Typography>

							<Typography sx={{ color: "#475569" }}>
								Inicia sesion para gestionar el catalogo y el
								contenido interno de IlloFlex.
							</Typography>
						</Stack>

						{errorMessage ? (
							<Alert severity='error'>{errorMessage}</Alert>
						) : null}

						<Box component='form' onSubmit={handleSubmit}>
							<Stack spacing={2.5}>
								<TextField
									label='Correo admin'
									name='email'
									type='email'
									value={formData.email}
									onChange={handleChange}
									required
									fullWidth
								/>

								<TextField
									label='Contrasena'
									name='password'
									type='password'
									value={formData.password}
									onChange={handleChange}
									required
									fullWidth
								/>

								<Button
									type='submit'
									variant='contained'
									size='large'
									disabled={isSubmitting}
									sx={{
										textTransform: "none",
										fontWeight: 600,
										borderRadius: 999,
										py: 1.2,
										backgroundColor: "#1d4ed8",
										boxShadow: "none",
										"&:hover": {
											backgroundColor: "#1e40af",
											boxShadow: "none",
										},
									}}>
									{isSubmitting
										? "Iniciando sesion..."
										: "Entrar como admin"}
								</Button>
							</Stack>
						</Box>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
