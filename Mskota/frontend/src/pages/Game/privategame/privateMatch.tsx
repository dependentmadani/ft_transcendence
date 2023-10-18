import { useEffect, useRef,useState } from 'react'

import { IoMdExit} from "react-icons/io";
import Switch from '@mui/material/Switch';
import { ping_pong} from './privatescript4'
import { useNavigate } from 'react-router-dom';
import {tooken as Token } from './ChatGame';


export default function PrivateMatchGame()
{
  const flag = useRef(false)
  const canvas = useRef(null)
  const [leftballs, setLeftBalls] = useState(['grey', 'grey', 'grey', 'grey', 'grey']);
  const [rightballs, setRightBalls] = useState(['grey', 'grey', 'grey', 'grey', 'grey']);
  
  const navigate = useNavigate();
  
  const goback = () =>
  {
    navigate(-1);
  }

  useEffect(() => {

  if (flag.current === false)
  {
    
    ping_pong(canvas.current,
     Token
        ,(left:any) =>
        {
          const updatedBallColors = leftballs.map((color, index) => (index < left ? 'purple' : 'gray'));
          setLeftBalls(updatedBallColors);
        },
        (right:any)=>
        {
          const updatedBallColors = rightballs.map((color, index) => (4 - index < right ? 'purple' : 'gray'));
          setRightBalls(updatedBallColors);
        })
      flag.current = true 
    }
  },  [leftballs, rightballs, Token])
  

  
  return (
    
    <div >
    <div className= "vs">
        <img src="./src/assets/img/vs.png"/>
    </div>
  
    <div id="profile1"> 
          <img className='profile1Img' src='./src/assets/img/akinator.png'></img>
          <strong className='profile1id'>Akinator</strong>
          
          <div className="BallScore1">
          {leftballs.map((color, index) => (
            <div key={`ball1_${index}`} className={`pl1 ball_${index + 1}`} style={{ backgroundColor: color }}></div>
            ))}
        </div>
    </div>
    <div id="profile2">
          <img className='profile2Img' src='./src/assets/img/jenny.png'></img>
          <strong className='profile2id'>Gennie</strong>
          
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
        <button id="ButtonStart" className='ButtonStart' >
        <strong className='startplus'>Start</strong>
        <img className='Iconpaddles' src="./src/assets/img/IconPaddles.png"></img>
        </button>
      </div>
  </div>
   )
}