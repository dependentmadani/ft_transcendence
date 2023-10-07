import { createBrowserRouter } from "react-router-dom";
// import { AuthLayout } from "./pages/layouts/AuthLayout";
import { Login } from "./pages/Login/login";
import { Signup } from "./pages/SignUp/signup";
import { HomeChat } from "./pages/Chat/HomeChat";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game/ComponentReact/game";
import Akinator from "./pages/Game/ComponentReact/akinator";
import ClassicGame from "./pages/Game/ComponentReact/classic_game";
import MatchGame from "./pages/Game/ComponentReact/match";
// import { Chattest } from "./pages/Chattest";

export const router = createBrowserRouter([
    {
        // element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
            { path: '/', element: <Home /> },
            { path: '/chat', element: <HomeChat /> },
            { path: '/game', element: <Game /> },
            { path: '/game/akinator', element: <Akinator /> },
            { path: '/game/ClassicGame', element: <ClassicGame /> },
            { path: '/game/matchgame', element: <MatchGame /> },
            // { path: '/', element: <Lista /> },
        ]
    }
])