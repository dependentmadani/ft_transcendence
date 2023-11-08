import { useEffect, useRef,useState } from 'react'
import './classic.css'
import { IoMdExit} from "react-icons/io";
import Switch from '@mui/material/Switch';
import { ping_pong} from '../ScriptGame/AkinatorPong'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStart } from '@/context/startContext';
import { useUrl } from '@/context/UrlContext';
import Discripion from './description';


interface User {
  username: string,
  avatar: string,
}

export default function Akinator()
{
  const [musicOn, setMusicOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [start, setStart] = useStart();
  const navigate = useNavigate();
  const [myUrl, setMyUrl] = useUrl();


  const goback = () => {
    setMusicOn(false);
    navigate('/game')
  };

  const flag = useRef(false)
  const canvas = useRef(null)
  const [size, setSize] = useState<'small' | 'medium'>('medium');
  
  const [leftballs, setLeftBalls] = useState<number>(0);
  const [rightballs, setRightBalls] = useState<number>(0);

  
  function fetchData() {
    if (flag.current === false)
    {
      ping_pong(canvas.current,(left:any) => {setLeftBalls(left);},(right:any)=>{setRightBalls(right);})
      flag.current = true 
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    }
  }
  
  async function addHistory(sure:boolean) {
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% : ', rightballs)
    if ((leftballs === 5 || rightballs === 5 || sure) && start) {
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
      try {
        const res = await axios.post(`http://${import.meta.env.VITE_BACK_ADDRESS}/history/add-result`,
        {
          opp_name: `akinator`,
          opp_score: sure ? 5 : leftballs,
          my_score: rightballs,
        },
        {withCredentials: true}
        )
        console.log('res : ', res)
        setStart(false)
      }catch (err) {
        console.log('Error Fetcing data : ', err)
      }
    }
  }

  useEffect(() => {

    fetchData();
    addHistory(false);
  },  [leftballs, rightballs])


  const [Userdata, setUserdata] = useState<User>()

  useEffect(() => {
    const getUserData = async () => {
      const res = await axios.get(`http://localhost:8000/users/me`, { withCredentials: true })
      setUserdata(res.data)
    }

    getUserData()
  
  }, [])


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


  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (start) {
        addHistory(true) 
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [start]); // Add start to the dependency array
  
  const score = ['score-1', 'score-2', 'score-3', 'score-4', 'score-5']

  return (
    <div className='game-mode'>
      <div className='game-dimension'>
        <div id='players'>
            <div id="profile1"> 
                <img className='profile1Img' src='/src/imgs/boot.jpg' onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }}   />
                <div className='profile1id'> Akinator </div>
                <div className="BallScore1">
                  {score.map((element, index) => (
                    <div key={element} style={index < leftballs ? { backgroundColor: 'cyan' } : {}}></div>
                  ))}
                </div>


            </div>
                  <img className= "players-vs" src="/src/assets/img/vs.png"/>
            <div id="profile2">
              <img className='profile2Img' src={Userdata?.avatar} onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} />
              <div className='profile2id'> {Userdata?.username} </div>
              <div className="BallScore2">
                {score.map((element, index) => (
                  <div key={element} style={5 - index <= rightballs ? { backgroundColor: 'cyan' } : {}}></div>
                ))}
              </div>
            </div>
        </div>
        <div className='dimension-canvas'>
          <canvas ref={canvas} id = "canvas1"  width='1000px' height='600px' > </canvas>
          <button id="ButtonStart" className='ButtonStart' onClick={() => {setStart(true);}}>
            <span className='startplus'>Start</span>
            <img className='Iconpaddles' src="/src/assets/img/IconPaddles.png" />
          </button>
          <Discripion mode='akinator' />
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
      <button id="ExitGame" className='buttonExit' onClick={() => {setStart(false); navigate('/game')}}>
        <img src="/src/imgs/svg/exit.svg" alt="exit"  />
        <span className ="EXIT"> Exit</span>
      </button> 
    </div>
  
  </div>
  )
}
