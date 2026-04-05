import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import TestHomePage from "../pages/TestHomePage";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/test",
		element: <TestHomePage />,
	},
]);

export default function AppRouter() {
	return <RouterProvider router={router} />;
}
