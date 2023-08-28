import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./pages/layouts/AuthLayout";
import Login from "./pages/Login/login";
import { Signup } from "./pages/SignUp/signup";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/Error/Error";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
            { path: '/', element: <Home /> },
            // { path: '/', element: <Lista /> },
        ],
        errorElement: <NotFound />
    }
])