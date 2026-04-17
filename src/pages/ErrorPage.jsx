import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();

	return (
		<Box sx={{ py: 8 }}>
			<Container maxWidth="md">
				<Stack spacing={3}>
					<Typography variant="h1">Ha ocurrido un error</Typography>
					<Typography variant="body1" sx={{ color: "#475569" }}>
						No hemos podido cargar la pagina solicitada.
					</Typography>
					{error?.message ? (
						<Typography variant="body2" sx={{ color: "#64748b" }}>
							{error.message}
						</Typography>
					) : null}
					<Button
						component={RouterLink}
						to="/"
						variant="contained"
						sx={{ alignSelf: "flex-start", textTransform: "none" }}
					>
						Volver al inicio
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}
