import './NotFriendProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
// import My from '@/imgs/add-friend.svg'
import { ReactSVG } from "react-svg";

interface MySVGComponentProps {
    className: string;
    icon: string;
  }

const MySVGComponent:MySVGComponentProps = ({class_name, icon}) => (
  <svg 
    className='kika'
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-4.59 -4.59 55.08 55.08"
    xmlSpace="preserve"
    stroke="#00000"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
    <g id="SVGRepo_iconCarrier">
      <g>
        <g>
          <path d="M43.162,26.681c-1.564-1.578-3.631-2.539-5.825-2.742c1.894-1.704,3.089-4.164,3.089-6.912 c0-5.141-4.166-9.307-9.308-9.307c-4.911,0-8.932,3.804-9.281,8.625c4.369,1.89,7.435,6.244,7.435,11.299 c0,1.846-0.42,3.65-1.201,5.287c1.125,0.588,2.162,1.348,3.066,2.26c2.318,2.334,3.635,5.561,3.61,8.851l-0.002,0.067 l-0.002,0.057l-0.082,1.557h11.149l0.092-12.33C45.921,30.878,44.936,28.466,43.162,26.681z" />
          <path d="M23.184,34.558c1.893-1.703,3.092-4.164,3.092-6.912c0-5.142-4.168-9.309-9.309-9.309c-5.142,0-9.309,4.167-9.309,9.309 c0,2.743,1.194,5.202,3.084,6.906c-4.84,0.375-8.663,4.383-8.698,9.318l-0.092,1.853h14.153h15.553l0.092-1.714 c0.018-2.514-0.968-4.926-2.741-6.711C27.443,35.719,25.377,34.761,23.184,34.558z" />
          <path d="M6.004,11.374v3.458c0,1.432,1.164,2.595,2.597,2.595c1.435,0,2.597-1.163,2.597-2.595v-3.458h3.454 c1.433,0,2.596-1.164,2.596-2.597c0-1.432-1.163-2.596-2.596-2.596h-3.454V2.774c0-1.433-1.162-2.595-2.597-2.595 c-1.433,0-2.597,1.162-2.597,2.595V6.18H2.596C1.161,6.18,0,7.344,0,8.776c0,1.433,1.161,2.597,2.596,2.597H6.004z" />
        </g>
      </g>
    </g>
  </svg>
);



function ProfileInfo () {

    const {client} = useClient();

    return (
        <div className='profile-info1'>
            <div className='profile-info1-left'>
                <div className='profile-img1'>
                    <div id='status'>
                      <span>online</span>
                      <div></div>
                    </div>
                    <img src={client.avatar ? client.avatar : 'src/imgs/user-img.png'} alt="user-img" />
                </div>
            </div>
            <div className='profile-info1-right'>
                <div className='profile-name-rank1'>
                    <div className='profile-name1'> {client.username ? client.username : 'hamid'} </div>
                    <div className='profile-rank1'> 5 </div>
                </div>
                <div className='profile-buttons'>
                    <ReactSVG src='src/imgs/add-user.svg' beforeInjection={(svg) => { svg.classList.add("add-friend"); }} />
                    <ReactSVG src='src/imgs/play-game.svg' beforeInjection={(svg) => { svg.classList.add("play-game"); }} />
                </div>
            </div>
        </div>
    )
}




function NotFriendProfile () {

  console.log('profile')


    return (
        <div className='profile'>
                <ProfileInfo />
        </div>
    )
}

export default NotFriendProfile;
