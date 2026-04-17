import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import RiasecDonutChart from "../components/results/RiasecDonutChart";

export default function TestResultPage() {
	const location = useLocation();
	const result = location.state?.result || null;

	if (!result) {
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
								sx={{ color: "#1d4ed8", fontWeight: 700 }}
							>
								Resultado del test
							</Typography>
							<Typography
								variant="h1"
								sx={{ fontSize: { xs: "2.2rem", md: "3rem" } }}
							>
								No se pudo cargar el resultado
							</Typography>
							<Alert severity="warning">
								No hemos encontrado el resultado en esta navegación. Más adelante
								conectaremos una recuperación directa del resultado por UUID.
							</Alert>
							<Button
								component={RouterLink}
								to="/test/flujo"
								variant="contained"
								sx={{
									alignSelf: "flex-start",
									textTransform: "none",
									fontWeight: 600,
									borderRadius: 999,
									px: 3,
								}}
							>
								Volver al test
							</Button>
						</Stack>
					</Paper>
				</Container>
			</Box>
		);
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
							variant="body2"
							sx={{ color: "#64748b", fontStyle: "italic" }}
						>
							Este resultado es una orientación inicial para ayudarte a seguir
							explorando posibilidades académicas y profesionales.
						</Typography>

						<Typography
							variant="overline"
							sx={{ color: "#1d4ed8", fontWeight: 700, letterSpacing: "0.08em" }}
						>
							Resultado del test
						</Typography>

						<Typography
							variant="h1"
							sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, lineHeight: 1.08 }}
						>
							Tu perfil principal es {result.perfil_principal.nombre}
						</Typography>

						<Box
							sx={{
								p: { xs: 3, md: 4 },
								borderRadius: 3,
								border: "1px solid #dbe2f0",
								backgroundColor: "#ffffff",
							}}
						>
							<Stack spacing={3}>
								<RiasecDonutChart
									normalizedScores={result.puntuaciones?.normalizadas}
									principalProfileName={result.perfil_principal.nombre}
								/>
								<Typography variant="body1" sx={{ color: "#475569" }}>
									{result.perfil_principal.descripcion}
								</Typography>
							</Stack>
						</Box>

						{result.perfil_secundario && (
							<Box
								sx={{
									p: 3,
									borderRadius: 3,
									border: "1px solid #dbe2f0",
									backgroundColor: "#f8fbff",
								}}
							>
								<Stack spacing={1}>
									<Typography variant="h3" sx={{ fontSize: "1.25rem" }}>
										Perfil secundario
									</Typography>
									<Typography variant="body1" sx={{ color: "#334155" }}>
										{result.perfil_secundario.nombre}
									</Typography>
									<Typography variant="body2" sx={{ color: "#475569" }}>
										{result.perfil_secundario.descripcion}
									</Typography>
								</Stack>
							</Box>
						)}

						{result.perfil_terciario && (
							<Box
								sx={{
									p: 3,
									borderRadius: 3,
									border: "1px solid #dbe2f0",
									backgroundColor: "#ffffff",
								}}
							>
								<Stack spacing={1}>
									<Typography variant="h3" sx={{ fontSize: "1.25rem" }}>
										Perfil terciario
									</Typography>
									<Typography variant="body1" sx={{ color: "#334155" }}>
										{result.perfil_terciario.nombre}
									</Typography>
									<Typography variant="body2" sx={{ color: "#475569" }}>
										{result.perfil_terciario.descripcion}
									</Typography>
								</Stack>
							</Box>
						)}

						<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
							{/* Lleva a una pantalla separada para no alargar el resultado RIASEC. */}
							<Button
								component={RouterLink}
								to="/test/recomendaciones"
								state={{ result }}
								variant="contained"
								sx={{
									textTransform: "none",
									fontWeight: 600,
									borderRadius: 999,
									px: 3,
									backgroundColor: "#1d4ed8",
									boxShadow: "none",
								}}
							>
								Ver recomendaciones de ciclos
							</Button>

							<Button
								component={RouterLink}
								to="/"
								variant="outlined"
								sx={{
									textTransform: "none",
									fontWeight: 600,
									borderRadius: 999,
									px: 3,
								}}
							>
								Volver al inicio
							</Button>
						</Stack>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
