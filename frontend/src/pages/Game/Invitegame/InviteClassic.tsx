import { useEffect, useRef,useState } from 'react'
import '../ComponentReact/classic.css'
import Switch from '@mui/material/Switch';
import { ping_pong} from '../ScriptGame/InviteClassicPong'
import { useNavigate } from 'react-router-dom';
import Discripion from '../ComponentReact/description';
import axios from 'axios';
import { useStart } from '@/context/startContext';

interface User
{
  id:number,
  username: string,
  avatar: string,
}

type MyComponentProps = {
  ProfileID1: number;
  ProfileID2: number;
};

// const MyComponent: React.FC<MyComponentProps> = ({ name, age }) => {
const InviteClassic: React.FC<MyComponentProps> = ({ProfileID1, ProfileID2}) =>
{
  const [musicOn, setMusicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const navigate = useNavigate();

  const flag = useRef(false)
  const canvas = useRef(null)
  const [, setStart] = useStart();
  const [size, setSize] = useState<'small' | 'medium'>('medium');
  
  const [leftballs, setLeftBalls] = useState(['grey', 'grey', 'grey', 'grey', 'grey']);
  const [rightballs, setRightBalls] = useState(['grey', 'grey', 'grey', 'grey', 'grey']);
  // const [ProfileID1, setProfileID1] = useState(0);
  // const [ProfileID2, setProfileID2] = useState(0);
  const [Userdata, setUserdata] = useState<User>()

  const [user1, setUser1] = useState<User | null>(null);
  const [user2, setUser2] = useState<User | null>(null);
  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/me`, { withCredentials: true })
      setUserdata(res.data)
    }
    getUserData()
  }, [Userdata])

  useEffect(() => {
    if (Userdata?.id)
        setUser1({ id: Userdata?.id, username: Userdata?.username, avatar: Userdata?.avatar });
    if (ProfileID1)
    {
    axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${ProfileID1}`, { withCredentials: true })
      .then((response) => {
        setUser1(response.data);
      })
      .catch(() => {
        // console.log('Error fetching user data for ProfileID1', error);
      });
  }
}, [ProfileID1,Userdata?.id]);

useEffect(() => {
    setUser2({ id:2, username: "Waiting ...", avatar: "/src/assets/img/jenny.png" });
  if (ProfileID2)
  {
  axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/users/${ProfileID2}`, { withCredentials: true })
      .then((response) => {
        setUser2(response.data);
      })
      .catch(() => {
        // console.log('Error fetching user data for ProfileID2', error);
      });
  }
}, [ProfileID2]);
  
  useEffect(() => {
    if (flag.current === false && Userdata?.id)
    {
      ping_pong(canvas.current,(left:any) => {setLeftBalls(left);},(right:any)=>{setRightBalls(right);},
        Userdata.id,
        ProfileID1,
        ProfileID2
      )
      flag.current = true 
    }
  },  [leftballs,rightballs, Userdata?.id])

  const updateCanvasWidth = () => {

    const container = document.querySelector('.game-mode') as HTMLElement;
    const dimension = document.querySelector('.game-dimension') as HTMLElement;
    const dimension_canvas = document.querySelector('.dimension-canvas') as HTMLElement;
    // const canvas = document.getElementById('canvas1');
    const players = document.getElementById('players');
    if (container && players && dimension) {
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
        dimension.style.width = `${_height * .75 * 1.25}px`;
        dimension.style.height = `${_height * .75}px`;
      }
      else if (_height > tmp_height) {
        
        dimension.style.width = `${_width}px`;
        dimension.style.height = `${_width * .75}px`;
      }
  
      dimension_canvas.style.width =  `${dimension.getBoundingClientRect().width}px`;
      dimension_canvas.style.height = `${dimension.getBoundingClientRect().width * .6}px`;
  
      players.style.width = `${dimension.getBoundingClientRect().width}px`;
      players.style.height = `${dimension.getBoundingClientRect().height * .15}px`;
  
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
        <div className='game-dimension'>
          <div id='players'>
              <div id="profile1"> 
                  <img className='profile1Img' src={user1?.avatar} onError={(e) => { const target = e.target as HTMLImageElement
                    target.src = '/src/assets/imgs/user-img.png'; }} /*src={user1?.avatar}*/ />
                  <div className='profile1id' > {user1?.username}</div>
              </div>
                    <img className= "players-vs" src="/src/assets/img/vs.png"/>
              <div id="profile2">
                <img className='profile2Img' src={user2?.avatar} onError={(e) => { const target = e.target as HTMLImageElement
                  target.src = '/src/assets/imgs/user-img.png'; }} />
                <div className='profile2id'>  {user2?.username} </div>
              </div>
          </div>
          <div className='dimension-canvas'>
            <canvas ref={canvas} id = "canvas1"  width='1000px' height='600px' > </canvas>
            <button id="ButtonStart" className='ButtonStart'  onClick={() => {setStart(true);}} >
              <span className='startplus'>Start</span>
              <img className='Iconpaddles' src="/src/assets/img/IconPaddles.png" />
            </button>
            <Discripion mode='classic' />
          </div>
          </div>
      <div className='game-setting'>
        <span id='setting-title' > Settings </span>
        <div id = "box">
            <div className = 'music'>
              <span> Music </span>&nbsp;
              <Switch id= "music_switch"  defaultChecked size={size} onChange={() => {setMusicOn(!musicOn)}} /> &nbsp;
              <span id='state' > {musicOn ? 'On' : 'Off'} </span>
            </div>
            <div className = 'sound'>
              <span> Sound </span> &nbsp;
              <Switch id= "sound_switch" defaultChecked  size={size} onChange={() => {setSoundOn(!soundOn)}} />&nbsp;
              <span id='state' > {soundOn ? 'On' : 'Off'} </span>
            </div>
        </div>
        <button id="ExitGame" className='buttonExit' onClick={() => {navigate('/game')}}>
          <img src="/src/assets/imgs/svg/exit.svg" alt="exit"  />
          <span className ="EXIT"> Exit</span>
        </button> 
      </div>
    
    </div>
     )
}

export default InviteClassic;