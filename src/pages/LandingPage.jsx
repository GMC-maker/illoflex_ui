import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function LandingPage() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				background:
					"linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f6f7fb 100%)",
				py: 8,
			}}
		>
			<Container maxWidth="lg">
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
							Orientacion academica y profesional
						</Typography>

						<Typography
							variant="h1"
							sx={{
								maxWidth: 700,
								fontSize: { xs: "2.6rem", md: "4rem" },
								lineHeight: 1.05,
							}}
						>
							Descubre opciones formativas acordes a tu perfil vocacional.
						</Typography>

						<Typography
							variant="body1"
							sx={{
								maxWidth: 720,
								color: "#475569",
								fontSize: { xs: "1rem", md: "1.1rem" },
							}}
						>
							IlloFlex te ayuda a explorar tus intereses a traves de un test vocacional
							basado en RIASEC para recomendarte familias profesionales y ciclos
							formativos de forma clara y sencilla.
						</Typography>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<Button
								component={RouterLink}
								to="/test"
								variant="contained"
								size="large"
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
								Empezar test
							</Button>

							<Button
								component={RouterLink}
								to="/test"
								variant="outlined"
								size="large"
								sx={{
									alignSelf: "flex-start",
									textTransform: "none",
									fontWeight: 600,
									px: 3,
									py: 1.25,
									borderRadius: 999,
									borderColor: "#bfdbfe",
									color: "#1e3a8a",
								}}
							>
								Ver flujo inicial
							</Button>
						</Stack>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
