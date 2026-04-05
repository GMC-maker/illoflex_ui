import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { createAnonymousTest } from "../services/testService";

export default function TestHomePage() {
	const navigate = useNavigate();
	const [isCreatingTest, setIsCreatingTest] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	async function handleStartTest() {
		setIsCreatingTest(true);
		setErrorMessage("");

		try {
			const testData = await createAnonymousTest();
			navigate(`/test/${testData.uuid}`);
		} catch (error) {
			let message = "No se pudo iniciar el test. Intentalo de nuevo.";

			if (error.response && error.response.data && error.response.data.mensaje) {
				message = error.response.data.mensaje;
			}

			setErrorMessage(message);
		} finally {
			setIsCreatingTest(false);
		}
	}

	return (
		<Box
			sx={{
				minHeight: "calc(100vh - 64px)",
				display: "flex",
				alignItems: "center",
				background:
					"linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f6f7fb 100%)",
				py: 8,
			}}
		>
			<Container maxWidth="md">
				<Paper
					elevation={0}
					sx={{
						p: { xs: 4, md: 6 },
						borderRadius: 4,
						border: "1px solid #dbe2f0",
						backgroundColor: "rgba(255, 255, 255, 0.92)",
					}}
				>
					<Stack spacing={3}>
						<Typography
							variant="overline"
							sx={{
								color: "#1d4ed8",
								fontWeight: 700,
								letterSpacing: "0.08em",
							}}
						>
							Test vocacional
						</Typography>

						<Typography
							variant="h1"
							sx={{
								fontSize: { xs: "2.4rem", md: "3.5rem" },
								lineHeight: 1.05,
							}}
						>
							Comienza tu test vocacional
						</Typography>

						<Typography
							variant="body1"
							sx={{
								color: "#475569",
								fontSize: { xs: "1rem", md: "1.1rem" },
							}}
						>
							Responderas una serie de preguntas sobre tus intereses y preferencias.
							A partir de tus respuestas, IlloFlex calculara tu perfil vocacional y te
							mostrara recomendaciones formativas acordes.
						</Typography>

						<Box
							sx={{
								p: 3,
								borderRadius: 3,
								border: "1px solid #dbe2f0",
								backgroundColor: "#f8fbff",
							}}
						>
							<Stack spacing={1.5}>
								<Typography variant="h3" sx={{ fontSize: "1.25rem" }}>
									Que ocurrira al empezar
								</Typography>
								<Typography variant="body2" sx={{ color: "#475569" }}>
									1. Se creara un test anonimo con identificador unico.
								</Typography>
								<Typography variant="body2" sx={{ color: "#475569" }}>
									2. Iras respondiendo las preguntas del cuestionario.
								</Typography>
								<Typography variant="body2" sx={{ color: "#475569" }}>
									3. Al finalizar, se calculara tu resultado y se mostraran
									recomendaciones.
								</Typography>
							</Stack>
						</Box>

						{errorMessage !== "" && (
							<Alert severity="error">{errorMessage}</Alert>
						)}

						<Button
							variant="contained"
							size="large"
							onClick={handleStartTest}
							disabled={isCreatingTest}
							sx={{
								alignSelf: "flex-start",
								textTransform: "none",
								fontWeight: 600,
								px: 3,
								py: 1.25,
								borderRadius: 999,
								backgroundColor: "#1d4ed8",
								boxShadow: "none",
								"&:hover": {
									backgroundColor: "#1e40af",
									boxShadow: "none",
								},
							}}
						>
							{isCreatingTest ? "Creando test..." : "Comenzar test"}
						</Button>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
