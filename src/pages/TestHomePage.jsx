import { Box, Container, Typography } from "@mui/material";

export default function TestHomePage() {
	return (
		<Box sx={{ py: 8 }}>
			<Container maxWidth='lg'>
				<Typography variant='h1' sx={{ mb: 2 }}>
					Inicio del test
				</Typography>
				<Typography variant='body1' sx={{ color: "#475569" }}>
					Aqui conectaremos el flujo principal del test vocacional con
					el backend.
				</Typography>
			</Container>
		</Box>
	);
}
