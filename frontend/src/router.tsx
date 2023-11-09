import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultSection from "@/components/Sections/defaultSection";
import Sign from "@/components/Sections/Sign";
import Section from "@/components/Sections/Section/Section";
import { useClient } from "@/context/clientContext";
import { useUrl } from "./context/UrlContext";
import { useEffect } from "react";
import { useStart } from "./context/startContext";
import axios from "axios";

async function addHistory(start:boolean) {

    if (start) {
        console.log('#$$$$$$$$$$$$$$$$$$$$$$$22222222222');
      try {
        console.log('#$$$$$$$$$$$$$$$$$$$$$$$');
        await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/history/add-result`,
        {
          opp_name: `akinator`,
          opp_score: 5 ,
          my_score: 0,
        },
        {withCredentials: true}
        )
      }catch (err) {
      }
    }
  }

function GetRouteElement(props:any) {
    
    const { client } = useClient();
    const [myUrl, setMyUrl] = useUrl();
    const [start, setStart] = useStart();

    const defaultList = ['/', '/home', '/about', '/team'];
    const list = ['/login', '/login_2fa', '/signup' , '/profile', '/profile/:username', '/chat', '/game', '/leaderboard', '/game/akinator' , '/game/classic', '/game/tennis', '/game/invite']

    console.log('start : ',start, ' | myURL : ' , myUrl)
    useEffect(() => {
        
        function reload() {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@ ')
            console.log('***start : ',start, ' | myURL : ' , myUrl)
            if (start) {
                console.log('HHHHDHDHHHDHHDHHHDHDHHDDDH ')
                addHistory(true);
                location.reload();
                setStart(false);
                setMyUrl(false);
            }
        }

        if (myUrl) {
            console.log('goooooool=======')
            reload();
        }
    
        window.addEventListener('popstate', reload);
        return () => {

          window.addEventListener('popstate', reload);
        };
      }, [myUrl]);
    
    if (defaultList.includes(props.tag) || list.includes(props.tag)) {
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

