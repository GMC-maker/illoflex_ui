import { useState } from "react";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
	AppBar,
	Box,
	Button,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import favicon from "../../assets/favicon.png";

export default function MainLayout() {
	const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);

	const handleOpenAdminMenu = (event) => {
		setAdminMenuAnchorEl(event.currentTarget);
	};

	const handleCloseAdminMenu = () => {
		setAdminMenuAnchorEl(null);
	};

	return (
		<Box sx={{ minHeight: "100vh", backgroundColor: "#f6f7fb" }}>
			<AppBar
				position='sticky'
				elevation={0}
				sx={{
					backgroundColor: "rgba(255, 255, 255, 0.92)",
					borderBottom: "1px solid #dbe2f0",
					backdropFilter: "blur(10px)",
					color: "#0f172a",
				}}>
				<Container maxWidth='lg'>
					<Toolbar
						disableGutters
						sx={{ justifyContent: "space-between", gap: 2 }}>
						<Box
							component={RouterLink}
							to='/'
							sx={{
								display: "inline-flex",
								alignItems: "center",
								gap: 1.25,
								textDecoration: "none",
								color: "inherit",
							}}>
							<Box
								component='img'
								src={favicon}
								alt='IlloFlex'
								sx={{ height: 28, width: 28, display: "block" }}
							/>
							<Typography
								variant='h5'
								sx={{ color: "#2563eb", fontWeight: 700 }}>
								IlloFlex
							</Typography>
						</Box>

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								flexWrap: "wrap",
								justifyContent: "flex-end",
							}}>
							<IconButton
								onClick={handleOpenAdminMenu}
								aria-label='Abrir opciones de administracion'
								sx={{
									p: 0.5,
									color: "#475569",
									backgroundColor: "transparent",
									"&:hover": {
										backgroundColor: "transparent",
										color: "#1d4ed8",
									},
								}}>
								<SettingsOutlinedIcon />
							</IconButton>

							<Button
								component={RouterLink}
								to='/test'
								variant='contained'
								sx={{
									textTransform: "none",
									fontWeight: 600,
									borderRadius: 999,
									px: 2.5,
									backgroundColor: "#1d4ed8",
									boxShadow: "none",
									"&:hover": {
										backgroundColor: "#1e40af",
										boxShadow: "none",
									},
								}}>
								Empezar test
							</Button>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<Box component='main'>
				<Outlet />
			</Box>

			<Menu
				anchorEl={adminMenuAnchorEl}
				open={Boolean(adminMenuAnchorEl)}
				onClose={handleCloseAdminMenu}>
				<MenuItem
					component={RouterLink}
					to='/admin/login'
					onClick={handleCloseAdminMenu}>
					Administracion
				</MenuItem>
			</Menu>
		</Box>
	);
}
