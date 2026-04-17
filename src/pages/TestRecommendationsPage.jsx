import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const MAX_COMPATIBILITY = 3;

// Convierte la afinidad interna en una lectura visual sencilla para el usuario.
function renderCompatibilityStars(compatibility) {
	const activeStars = Number(compatibility || 0);

	return Array.from({ length: MAX_COMPATIBILITY }, (_, index) =>
		index < activeStars ? "★" : "☆",
	).join("");
}

export default function TestRecommendationsPage() {
	const location = useLocation();
	const result = location.state?.result || null;
	const recommendations = result?.recomendaciones || [];

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
								Recomendaciones
							</Typography>
							<Typography
								variant="h1"
								sx={{ fontSize: { xs: "2.2rem", md: "3rem" } }}
							>
								No se pudieron cargar las recomendaciones
							</Typography>
							<Alert severity="warning">
								No hemos encontrado el resultado de esta navegación. Más adelante
								conectaremos la recuperación mediante enlace temporal.
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
				background:
					"linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f6f7fb 100%)",
				py: 8,
			}}
		>
			<Container maxWidth="lg">
				<Stack spacing={3}>
					<Box>
						<Typography
							variant="overline"
							sx={{ color: "#1d4ed8", fontWeight: 700, letterSpacing: "0.08em" }}
						>
							Recomendaciones
						</Typography>
						<Typography
							variant="h1"
							sx={{
								mt: 1,
								fontSize: { xs: "2.2rem", md: "3.2rem" },
								lineHeight: 1.08,
							}}
						>
							Ciclos alineados con tu perfil
						</Typography>
						<Typography variant="body1" sx={{ color: "#475569", mt: 1.5 }}>
							Estas familias profesionales se han seleccionado a partir de tu
							resultado RIASEC. Úsalas como punto de partida para explorar opciones,
							no como una decisión cerrada.
						</Typography>
					</Box>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
							gap: 2,
						}}
					>
						{recommendations.map((recommendation, index) => {
							const family = recommendation.familia;
							const cycles = recommendation.ciclos || [];

							return (
								<Paper
									key={family.id_familia}
									elevation={0}
									sx={{
										p: 3,
										borderRadius: 3,
										border:
											index === 0 ? "1px solid #2563eb" : "1px solid #dbe2f0",
										backgroundColor: "#ffffff",
										boxShadow:
											index === 0
												? "0 18px 45px rgba(37, 99, 235, 0.10)"
												: "0 12px 32px rgba(15, 23, 42, 0.06)",
									}}
								>
									<Stack spacing={1.5}>
										<Stack
											direction="row"
											spacing={1}
											alignItems="center"
											justifyContent="space-between"
										>
											<Typography
												variant="body2"
												sx={{ color: "#64748b", fontWeight: 700 }}
											>
												Área recomendada #{index + 1}
											</Typography>
											{index === 0 && (
												<Box
													sx={{
														px: 1.2,
														py: 0.4,
														borderRadius: 999,
														backgroundColor: "#1d4ed8",
														color: "#ffffff",
														fontSize: "0.75rem",
														fontWeight: 700,
													}}
												>
													Principal
												</Box>
											)}
										</Stack>

										<Typography variant="h3" sx={{ fontSize: "1.25rem" }}>
											{family.nombre}
										</Typography>
										<Typography variant="body2" sx={{ color: "#475569" }}>
											{family.descripcion}
										</Typography>

										<Box>
											<Typography
												variant="caption"
												sx={{ color: "#64748b", display: "block" }}
											>
												Compatibilidad con tu perfil
											</Typography>
											<Typography
												aria-label={`Compatibilidad ${recommendation.grado_afinidad} de 3`}
												sx={{
													color: "#1d4ed8",
													fontSize: "1.1rem",
													letterSpacing: "0.12em",
												}}
											>
												{renderCompatibilityStars(recommendation.grado_afinidad)}
											</Typography>
										</Box>
									</Stack>
								</Paper>
							);
						})}
					</Box>

					<Paper
						elevation={0}
						sx={{
							p: { xs: 3, md: 4 },
							borderRadius: 3,
							border: "1px solid #dbe2f0",
							backgroundColor: "rgba(255, 255, 255, 0.92)",
						}}
					>
						<Stack spacing={3}>
							<Typography variant="h2" sx={{ fontSize: "1.6rem" }}>
								Ciclos formativos sugeridos
							</Typography>

							{recommendations.map((recommendation) => {
								const family = recommendation.familia;
								const cycles = recommendation.ciclos || [];

								return (
									<Box key={family.id_familia}>
										<Typography variant="h3" sx={{ fontSize: "1.25rem", mb: 1.5 }}>
											{family.nombre}
										</Typography>

										{cycles.length > 0 ? (
											<Box
												sx={{
													display: "grid",
													gridTemplateColumns: {
														xs: "1fr",
														md: "repeat(3, 1fr)",
													},
													gap: 2,
												}}
											>
												{cycles.map((cycle) => (
													<Box
														key={cycle.id_ciclo}
														sx={{
															p: 2,
															borderRadius: 2.5,
															border: "1px solid #dbe2f0",
															backgroundColor: "#f8fbff",
														}}
													>
														<Stack spacing={1}>
															<Typography
																variant="body1"
																sx={{ color: "#1f2937", fontWeight: 700 }}
															>
																{cycle.nombre}
															</Typography>
															<Typography variant="body2" sx={{ color: "#475569" }}>
																{cycle.descripcion}
															</Typography>
															<Typography
																variant="caption"
																sx={{ color: "#64748b", display: "block" }}
															>
																{cycle.nivel} · {cycle.duracion_horas} horas
															</Typography>
														</Stack>
													</Box>
												))}
											</Box>
										) : (
											<Alert severity="info">
												Aún no hay ciclos cargados para esta familia profesional.
											</Alert>
										)}
									</Box>
								);
							})}
						</Stack>
					</Paper>

					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						<Button
							component={RouterLink}
							to="/test/resultado"
							state={{ result }}
							variant="outlined"
							sx={{
								textTransform: "none",
								fontWeight: 600,
								borderRadius: 999,
								px: 3,
							}}
						>
							Volver a mi perfil RIASEC
						</Button>
						<Button
							component={RouterLink}
							to="/"
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
							Volver al inicio
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}
