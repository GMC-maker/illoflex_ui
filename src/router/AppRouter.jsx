import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import LandingPage from "../pages/LandingPage";
import TestHomePage from "../pages/TestHomePage";
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
		],
	},
]);

export default function AppRouter() {
	return <RouterProvider router={router} />;
}
