import { createBrowserRouter } from "react-router-dom";
import DefaultSection from "./components/Sections/defaultSection";
import Sign from "./components/Sections/Sign";
import Section from "./components/Sections/Section/Section";
// import { AuthLayout } from "./pages/layouts/AuthLayout";

// import { Chattest } from "./pages/Chattest";

export const router = createBrowserRouter([
    {
        // element: <AuthLayout />,
        children: [
            { path: '/', element: <DefaultSection section='home' />},
            { path: '/home', element: <DefaultSection section='home' />},
            { path: '/about', element: <DefaultSection section='about' />},
            { path: '/team', element: <DefaultSection section='team' />},
            { path: '/login', element: <Sign tag='login' /> },
            { path: '/signup', element: <Sign tag='signup' /> },
            { path: '/profile', element: <Section section='profile' /> },
            { path: '/chat', element: <Section section='chat' /> },
            { path: '/game', element: <Section section='game' /> },
            // { path: '/game/akinator', element: <Akinator /> },
            // { path: '/game/ClassicGame', element: <ClassicGame /> },
            // { path: '/game/matchgame', element: <MatchGame /> },
            // { path: '/', element: <Lista /> },
        ]
    }
])