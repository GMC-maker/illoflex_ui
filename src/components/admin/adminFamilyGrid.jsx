import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
	Alert,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Paper,
	Stack,
	Typography,
} from "@mui/material";

export default function AdminFamilyGrid({
	families,
	isLoadingFamilies,
	familiesError,
	familyMenuAnchorEl,
	selectedFamilyForMenu,
	onOpenFamilyMenu,
	onCloseFamilyMenu,
	onStartEditFamily,
}) {
	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				borderRadius: 3,
				border: "1px solid #dbe2f0",
				backgroundColor: "#ffffff",
			}}>
			<Stack spacing={2}>
				<Typography variant='h6' sx={{ fontWeight: 700 }}>
					Familias profesionales
				</Typography>

				{isLoadingFamilies ? (
					<Typography sx={{ color: "#475569" }}>
						Cargando familias...
					</Typography>
				) : null}

				{familiesError ? (
					<Alert severity='error'>{familiesError}</Alert>
				) : null}

				{!isLoadingFamilies && !familiesError && families.length === 0 ? (
					<Alert severity='info'>
						No hay familias profesionales cargadas.
					</Alert>
				) : null}

				{!isLoadingFamilies && !familiesError ? (
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								lg: "repeat(3, 1fr)",
							},
							gap: 2,
						}}>
						{families.map((family) => (
							<Box
								key={family.id_familia}
								id={`family-card-${family.id_familia}`}
								sx={{
									p: 2,
									borderRadius: 2.5,
									border: "1px solid #dbe2f0",
									backgroundColor: "#f8fbff",
									height: "100%",
								}}>
								<Stack spacing={1}>
									<Stack
										direction='row'
										justifyContent='space-between'
										alignItems='flex-start'
										spacing={1}>
										<Typography
											variant='body1'
											sx={{ fontWeight: 700, color: "#1f2937" }}>
											{family.nombre}
										</Typography>

										{/* El engranaje se coloca arriba a la derecha de cada tarjeta. */}
										<IconButton
											size='small'
											onClick={(event) =>
												onOpenFamilyMenu(event, family)
											}
											sx={{ color: "#475569" }}>
											<SettingsOutlinedIcon fontSize='small' />
										</IconButton>
									</Stack>

									<Typography
										variant='body2'
										sx={{ color: "#475569" }}>
										{family.descripcion || "Sin descripcion"}
									</Typography>
								</Stack>
							</Box>
						))}
					</Box>
				) : null}

				{/* El menu se ancla al engranaje pulsado y solo activa la edicion al pulsar Editar. */}
				<Menu
					anchorEl={familyMenuAnchorEl}
					open={Boolean(familyMenuAnchorEl)}
					onClose={onCloseFamilyMenu}>
					<MenuItem onClick={onStartEditFamily}>
						Editar
					</MenuItem>
				</Menu>
			</Stack>
		</Paper>
	);
}
