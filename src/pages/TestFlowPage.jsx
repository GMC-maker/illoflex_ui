import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";

export default function TestFlowPage() {
	const { uuid } = useParams();

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
							Flujo del test
						</Typography>

						<Typography
							variant="h1"
							sx={{
								fontSize: { xs: "2.2rem", md: "3.2rem" },
								lineHeight: 1.08,
							}}
						>
							El test anonimo ya se ha creado correctamente
						</Typography>

						<Typography variant="body1" sx={{ color: "#475569" }}>
							Este paso confirma que el frontend ya puede crear un test real contra el
							backend. El siguiente bloque sera cargar y recorrer las preguntas del
							cuestionario.
						</Typography>

						<Box
							sx={{
								p: 3,
								borderRadius: 3,
								border: "1px solid #dbe2f0",
								backgroundColor: "#f8fbff",
							}}
						>
							<Typography variant="h3" sx={{ fontSize: "1.2rem", mb: 1 }}>
								UUID del test
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: "#334155",
									wordBreak: "break-word",
									fontFamily: "monospace",
								}}
							>
								{uuid}
							</Typography>
						</Box>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<Button
								component={RouterLink}
								to="/test"
								variant="outlined"
								sx={{
									alignSelf: "flex-start",
									textTransform: "none",
									fontWeight: 600,
									borderRadius: 999,
									px: 3,
								}}
							>
								Volver
							</Button>
							<Button
								disabled
								variant="contained"
								sx={{
									alignSelf: "flex-start",
									textTransform: "none",
									fontWeight: 600,
									borderRadius: 999,
									px: 3,
									backgroundColor: "#1d4ed8",
									boxShadow: "none",
								}}
							>
								Proximamente: cargar preguntas
							</Button>
						</Stack>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
