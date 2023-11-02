import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./pages/layouts/AuthLayout";
import { Login } from "./pages/Login/login";
import { Signup } from "./pages/SignUp/signup";
import { HomeChat } from "./pages/Chat/HomeChat";
import { Home } from "./pages/Home";
// import { Chattest } from "./pages/Chattest";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
            { path: '/', element: <Home /> },
            { path: '/chat', element: <HomeChat /> },
            // { path: '/', element: <Lista /> },
        ]
    }
])