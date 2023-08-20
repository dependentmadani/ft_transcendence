import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./pages/layouts/AuthLayout";
import Login from "./pages/login";
import { Signup } from "./pages/signup";
import { Home } from "./pages/Home";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
            { path: '/', element: <Home /> },
            // { path: '/', element: <Lista /> },
        ]
    }
])