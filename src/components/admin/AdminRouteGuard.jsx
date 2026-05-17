import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { getCurrentAdmin } from "../../services/adminAuthService";

export default function AdminRouteGuard({ children }) {
	// Guarda el estado de la comprobacion de sesion:
	// checking -> aun estamos consultando al backend
	// authenticated -> hay sesion admin valida
	// unauthenticated -> no hay sesion valida
	const [status, setStatus] = useState("checking");

	// Guarda los datos del admin autenticado cuando la comprobacion sale bien.
	const [admin, setAdmin] = useState(null);

	useEffect(() => {
		// Evita actualizar estado si el componente ya se ha desmontado.
		let isMounted = true;

		// Consulta al backend si existe una sesion admin valida por cookie.
		const checkAdminSession = async () => {
			try {
				const currentAdmin = await getCurrentAdmin();

				if (!isMounted) {
					return;
				}

				// Si el backend devuelve el admin, la ruta puede mostrarse.
				setAdmin(currentAdmin);
				setStatus("authenticated");
			} catch (error) {
				if (!isMounted) {
					return;
				}

				// Si falla la comprobacion, se fuerza la redireccion al login.
				setAdmin(null);
				setStatus("unauthenticated");
			}
		};

		checkAdminSession();

		return () => {
			isMounted = false;
		};
	}, []);

	// Mientras se comprueba la sesion, muestra una carga simple.
	if (status === "checking") {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#f6f7fb",
				}}>
				<CircularProgress />
			</Box>
		);
	}

	// Si no hay sesion valida, redirige al login admin.
	if (status === "unauthenticated") {
		return <Navigate to='/admin/login' replace />;
	}

	// Si hay sesion valida, renderiza la pagina protegida y le pasa el admin.
	return children(admin);
}
