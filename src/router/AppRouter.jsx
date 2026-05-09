import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AdminRouteGuard from "../components/admin/AdminRouteGuard";
import LandingPage from "../pages/LandingPage";
import TestHomePage from "../pages/TestHomePage";
import TestFlowPage from "../pages/TestFlowPage";
import TestResultPage from "../pages/TestResultPage";
import TestRecommendationsPage from "../pages/TestRecommendationsPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <LandingPage />,
			},
			{
				path: "test",
				element: <TestHomePage />,
			},
			{
				path: "test/flujo",
				element: <TestFlowPage />,
			},
			{
				path: "test/resultado",
				element: <TestResultPage />,
			},
			{
				path: "tus-resultados/:token",
				element: <TestResultPage />,
			},
			{
				path: "test/recomendaciones",
				element: <TestRecommendationsPage />,
			},
		],
	},
	{
		path: "/admin/login",
		element: <AdminLoginPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/admin",
		element: (
			<AdminRouteGuard>
				{(admin) => <AdminDashboardPage admin={admin} />}
			</AdminRouteGuard>
		),
		errorElement: <ErrorPage />,
	},
]);

export default function AppRouter() {
	return <RouterProvider router={router} />;
}
