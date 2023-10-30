import { useEffect, useRef,useState } from 'react'
import './classic.css'
import { IoMdExit} from "react-icons/io";
import Switch from '@mui/material/Switch';
import { ping_pong} from '../ScriptGame/ClassicPong'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReactSVG } from "react-svg";

interface User
{
  id:number,
  username: string,
  avatar: string,
}


export default function ClassicGame()
{
  const navigate = useNavigate();
  // let _size;
  const goback = () =>
  {
    navigate(-1);
  }
  const flag = useRef(false)
  const canvas = useRef(null)
  const [size, setSize] = useState<'small' | 'medium'>('medium');
  
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


const updateCanvasWidth = () => {
  console.log ('&&&&&&&&&&&&&&&&&&&&&')
  const container = document.querySelector('.game-mode') as HTMLElement;
  const dimention = document.querySelector('.game-dimention') as HTMLElement;
  const canvas = document.getElementById('canvas1');
  const players = document.getElementById('players');
  if (canvas && container && players && dimention) {
    console.log('ooooooooooooooooooo');
    let _width:number = container.getBoundingClientRect().width;
    let _height:number = container.getBoundingClientRect().height;

    if (window.innerHeight > 1000 || window.innerWidth > 2000)
      setSize('medium');
    else 
      setSize("small");

    if (window.innerWidth > window.innerHeight)
      _width = _width  * .6 ;
    else
      _width = _width  * .9 ;

    _width = _width > 1200 ? 1200 : _width;
    let tmp_height:number =  _width  * .75;

    if (tmp_height > _height * .75) {
      dimention.style.width = `${_height * .75 * 1.25}px`;
      dimention.style.height = `${_height * .75}px`;
    }
    else if (_height > tmp_height) {
      
      dimention.style.width = `${_width}px`;
      dimention.style.height = `${_width * .75}px`;
    }
    
    canvas.style.width =  `${dimention.getBoundingClientRect().width}px`;
    canvas.style.height = `${dimention.getBoundingClientRect().height * .85}px`;

    players.style.width = `${dimention.getBoundingClientRect().width}px`;
    players.style.height = `${dimention.getBoundingClientRect().height * .15}px`;

  }
};

useEffect(() => {
  updateCanvasWidth();
  window.addEventListener('resize', updateCanvasWidth);

  return () => {
    window.removeEventListener('resize', updateCanvasWidth);
  };
}, [])

  return (
    
    <div className='game-mode'>
        {/* <div >
        </div> */}
      <div className='game-dimention'>
      <div id='players'>
          <div id="profile1"> 
              <img className='profile1Img' src='/src/imgs/example.jpg'  /*src={user1?.avatar}*/ />
                {/* <span className='profile1id'>{user1?.username}  </span> */}
              <span className='profile1id'> Hamid </span>
              <div className="BallScore1">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                {/* {leftballs.map((color, index) => (
                  <div key={ball1${index}} className={pl1 ball${index + 1}} style={{ backgroundColor: color }}></div>
                ))} */}
              </div>
          </div>
                <img className= "players-vs" src="/src/assets/img/vs.png"/>
          <div id="profile2">
            <img className='profile2Img' src={user2?.avatar}></img>
            {/* <span className='profile2id'> {user2?.username}</span> */}
            <span className='profile2id'> Hamid </span>
            <div className="BallScore2">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              {/* {rightballs.map((color, index) => (
                <div key={ball2${index}} className={pl2 ball${index + 1}} style={{ backgroundColor: color }}></div>
              ))} */}
            </div>
          </div>
        </div>
        <canvas ref={canvas} id = "canvas1"  > </canvas>
      </div>
    <div className='game-setting'>
      <span id='setting-title' > Settings </span>
      <div id = "box">
          <div className = 'music'>
            <span> Music </span>&nbsp;
            <Switch id= "music_switch"  defaultChecked size={size} /> &nbsp;
            <span id='state' > On </span>
          </div>
          <div className = 'sound'>
            <span> Sound </span> &nbsp;
            <Switch id= "sound_switch" defaultChecked  size={size} />&nbsp;
            <span id='state' > On </span>
          </div>
      </div>
      <button className='buttonExit' onClick={goback}>
        <img src="/src/imgs/svg/exit.svg" alt="exit"  />
        <span className ="EXIT"> Exit</span>
      </button> 
    </div>

    <button id="ButtonStart" className='ButtonStart'>
      <span className='startplus'>Start</span>
      <img className='Iconpaddles' src="/src/assets/img/IconPaddles.png"></img>
    </button>
  
  </div>
   )
}
