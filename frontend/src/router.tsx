import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import DefaultSection from "@/components/Sections/defaultSection";
import Sign from "@/components/Sections/Sign";
import Section from "@/components/Sections/Section/Section";
import { useClient } from "@/context/clientContext";
import NotFriendProfile from  "@/components/Profile/NotFriend/NotFriendProfile"
import FriendProfile from "@/components/Profile/Friend/FriendProfile"
// import { AuthLayout } from "./pages/layouts/AuthLayout";

// import { Chattest } from "./pages/Chattest";

// const navigate = useNavigate();


function GetRouteElement(props:any) {
    
    const { client } = useClient();

    const defaultList = ['/', '/home', '/about', '/team'];
    const list = ['/login', '/login_2fa', '/signup' , '/profile', '/profile/:username', '/chat', '/game', '/leaderboard', '/game/akinator' , '/game/classic', '/game/tennis', '/game/invite']
    console.log(props.tag)
    // console.log(client.signedIn)
    // console.log(defaultList.includes(props.tag), list.includes(props.tag))
    if (defaultList.includes(props.tag) || list.includes(props.tag)) {
        console.log('**********************')
        if ((!client.signedIn || client.signedIn) && defaultList.includes(props.tag))
            return <DefaultSection section={props.tag} />;
        else if (!client.signedIn && list.includes(props.tag))
            return <Sign tag='login' />;
        else if (client.signedIn && props.tag === '/login_2fa')
            return <Sign tag='2fa' />;
        else if (client.signedIn && !client.signedUp)
            return <Sign tag='signup' />;
        else
            return <Section section={props.tag} />;
    }
    return <Navigate to='/' />
}


export const router = createBrowserRouter([
    {
        children: [
            { path: '/', element: < GetRouteElement tag='/' /> },
            { path: '/home', element: < GetRouteElement tag='/home' /> },
            { path: '/about', element: < GetRouteElement tag='/about' /> },
            { path: '/team', element: < GetRouteElement tag='/team' /> },
            { path: '/login', element: < GetRouteElement tag='/login' /> }, 
            { path: '/login_2fa', element: < GetRouteElement tag='/login_2fa' /> }, 
            { path: '/signup', element: < GetRouteElement tag='/signup' /> },
            { path: '/profile', element: < GetRouteElement tag='/profile' /> },
            { path: '/profile/:username', element: < GetRouteElement tag='/profile/:username' /> },
            { path: '/chat', element: < GetRouteElement tag='/chat' /> },
            { path: '/game', element: < GetRouteElement tag='/game' /> },
            { path: '/game/akinator', element: < GetRouteElement tag='/game/akinator' /> },
            { path: '/game/classic', element: < GetRouteElement tag='/game/classic' /> },
            { path: '/game/tennis', element: < GetRouteElement tag='/game/tennis' /> },
            { path: '/game/invite', element: < GetRouteElement tag='/game/invite' /> },
            { path: '/leaderboard', element: < GetRouteElement tag='/leaderboard' /> },
        ],
    },
]);

// export const router = createBrowserRouter([
//     {
//         // element: <AuthLayout />,
//         children: [
//             {   path: '/', 
//                 element:  (client.signedIn && !client.signedUp) ? <Sign tag='signup' /> : 
//                     <DefaultSection section='home' />
//             },
            
//             {   path: '/home', 
//                 element:  (client.signedIn && !client.signedUp) ? <Sign tag='signup' /> :  
//                     <DefaultSection section='home' />
//             },
            
//             {   path: '/about', 
//                 element:  (client.signedIn && !client.signedUp) ? <Sign tag='signup' /> : 
//                     <DefaultSection section='about' />
//             },
            
//             {   path: '/team', 
//                 element:  (client.signedIn && !client.signedUp) ? <Sign tag='signup' /> : 
//                     <DefaultSection section='team' />
//             },
            
//             {   path: '/login', 
//                 element: 
//                     !client.signedIn ? <Sign tag='login' /> : 
//                     !client.signedUp ?  <Navigate to='/signup'  /> :
//                     <Navigate to='/'  />
//             },
            
//             {   path: '/signup', 
//                 element:                
//                     !client.signedIn ? <Sign tag='login' /> : 
//                     !client.signedUp ?  <Navigate to='/signup'  /> :
//                     <Navigate to='/'  />
//             },
            
//             {   path: '/profile', 
//                 element:  
//                     !client.signedIn ? <Navigate to='/login'  /> : 
//                     !client.signedUp ?  <Navigate to='/signup'  /> :
//                     <Section section='profile' /> 
//             },
            
//             {   path: '/chat', 
//                 element:  
//                     !client.signedIn ? <Navigate to='/login'  /> : 
//                     !client.signedUp ?  <Navigate to='/signup'  /> :
//                     <Section section='chat' /> 
//             },
            
//             {   path: '/game', 
//                 element:  
//                     !client.signedIn ? <Navigate to='/login'  /> : 
//                     !client.signedUp ?  <Navigate to='/signup'  /> :
//                     <Section section='game' /> 
//             },
            
//             // { path: '/game/akinator', element: <Akinator /> },
//             // { path: '/game/ClassicGame', element: <ClassicGame /> },
//             // { path: '/game/matchgame', element: <MatchGame /> },
//             // { path: '/', element: <Lista /> },
//         ]
//     }
// ])



