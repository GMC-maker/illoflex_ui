import { useState } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
	AppBar,
	Box,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import favicon from "../../assets/favicon.png";

export default function MainLayout() {
	const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
	const [contactTooltip, setContactTooltip] = useState(
		"xgceldia796@ieshnosmachado.org",
	);

	const handleOpenAdminMenu = (event) => {
		setAdminMenuAnchorEl(event.currentTarget);
	};

	const handleCloseAdminMenu = () => {
		setAdminMenuAnchorEl(null);
	};

	const handleCopyContactEmail = async () => {
		try {
			await navigator.clipboard.writeText("xgceldia796@ieshnosmachado.org");
			setContactTooltip("Correo copiado");

			setTimeout(() => {
				setContactTooltip("xgceldia796@ieshnosmachado.org");
			}, 1800);
		} catch (error) {
			setContactTooltip("xgceldia796@ieshnosmachado.org");

			setTimeout(() => {
				setContactTooltip("xgceldia796@ieshnosmachado.org");
			}, 2200);
		}
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
							<Tooltip title={contactTooltip}>
								<IconButton
									onClick={handleCopyContactEmail}
									aria-label='Copiar correo de contacto'
									sx={{
										p: 0.5,
										color: "#475569",
										backgroundColor: "transparent",
										"&:hover": {
											backgroundColor: "transparent",
											color: "#149650",
										},
									}}>
									<MailOutlineIcon />
								</IconButton>
							</Tooltip>

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
