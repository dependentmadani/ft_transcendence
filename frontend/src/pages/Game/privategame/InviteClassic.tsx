import { useEffect, useRef,useState } from 'react'
// import './InviteClassic.css'
import { IoMdExit} from "react-icons/io";
import Switch from '@mui/material/Switch';
import { ping_pong} from '../ScriptGame/InviteClassicPong'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User
{
  id:number,
  username: string,
  avatar: string,
}

export default function InviteClassic()
{
  const navigate = useNavigate();
  const goback = () =>
  {
    navigate(-1);
  }
  const flag = useRef(false)
  const canvas = useRef(null)
  
  const [leftballs, setLeftBalls] = useState(['grey', 'grey', 'grey', 'grey', 'grey']);
  const [rightballs, setRightBalls] = useState(['grey', 'grey', 'grey', 'grey', 'grey']);
  const [ProfileID1, setProfileID1] = useState(0);
  const [ProfileID2, setProfileID2] = useState(0);
  const [Userdata, setUserdata] = useState<User>()

  const [user1, setUser1] = useState<User | null>(null);
const [user2, setUser2] = useState<User | null>(null);
  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get(`http://localhost:8000/users/me`, { withCredentials: true })
      setUserdata(res.data)
    }
    getUserData()
  }, [Userdata])

  useEffect(() => {
    if (Userdata?.id)
        setUser1({ id: Userdata?.id, username: Userdata?.username, avatar: Userdata?.avatar });
    if (ProfileID1)
    {
    axios.get(`http://localhost:8000/users/${ProfileID1}`, { withCredentials: true })
      .then((response) => {
        setUser1(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data for ProfileID1', error);
      });
  }
}, [ProfileID1,Userdata?.id]);

useEffect(() => {
    setUser2({ id:2, username: "Waiting ...", avatar: "/src/assets/img/jenny.png" });
  if (ProfileID2)
  {
  axios.get(`http://localhost:8000/users/${ProfileID2}`, { withCredentials: true })
      .then((response) => {
        setUser2(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data for ProfileID2', error);
      });
  }
}, [ProfileID2]);
  
  useEffect(() => {
    if (flag.current === false && Userdata?.id)
    {
      ping_pong(canvas.current,(left:any) => {
        const updatedBallColors = leftballs.map((color, index) => (index < left ? 'purple' : 'gray'));
        setLeftBalls(updatedBallColors);
      },(right:any)=>{
          const updatedBallColors = rightballs.map((color, index) => (4 - index < right ? 'purple' : 'gray'));
          setRightBalls(updatedBallColors);
        },
        Userdata.id,
        (prl1:any) =>{setProfileID1(prl1);},
        (prl2:any) =>{setProfileID2(prl2);}
      )
      flag.current = true 
    }
  },  [leftballs,rightballs, Userdata?.id,ProfileID1,ProfileID2])
// console.log(`PROID1 ${ProfileID1}--------|PROID2${ProfileID2}`)
  return (
    
    <div >
    <div >
        <img className= "vs" src="/src/assets/img/vs.png"/>
    </div>
    <div id="profile1"> 
            <img className='profile1Img' src={user1?.avatar} />
            <strong className='profile1id'>{user1?.username} </strong>
          <div className="BallScore1">
          {leftballs.map((color, index) => (
            <div key={`ball1_${index}`} className={`pl1 ball_${index + 1}`} style={{ backgroundColor: color }}></div>
          ))}
        </div>
    </div>
    <div id="profile2">
    
          <img className='profile2Img' src={user2?.avatar}></img>
          <strong className='profile2id'>{user2?.username}</strong>

          <div className="BallScore2">
          {rightballs.map((color, index) => (
            <div key={`ball2_${index}`} className={`pl2 ball_${index + 1}`} style={{ backgroundColor: color }}></div>
          ))}
          </div>
    </div>
    <div id = "setting" > 
          <strong >Settings </strong>
    </div>
    <div id = "box">
        <div className = 'music'>
          <strong> Music</strong>&nbsp;
          <Switch id= "music_switch"  defaultChecked size='small'/> &nbsp;
          <small>On</small>
        </div>
        <div className = 'sound'>
          <strong> Sound </strong> &nbsp;
          <Switch id= "sound_switch" defaultChecked size = 'small' />&nbsp;
          <small>On</small>
        </div>
    </div>
      <button className='buttonExit' onClick={goback}>
        <IoMdExit className="icon"> </IoMdExit>&nbsp;
        <strong className ="EXIT"> Exit</strong>
      </button> 

    <canvas ref={canvas} id = "canvas1"  height = "600" width = "1000" > </canvas>
      <div id="start">
        <button id="ButtonStart" className='ButtonStart'>
        <strong className='startplus'>Start</strong>
        <img className='Iconpaddles' src="/src/assets/img/IconPaddles.png"></img>
        </button>
      </div>
  
  </div>
   )
}
