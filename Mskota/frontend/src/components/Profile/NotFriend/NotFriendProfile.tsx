import './NotFriendProfile.css'
import { useClient } from '@/context/clientContext';
import MyPieChart from '@/components/Profile/PieChart/pieChart'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
// import My from '@/imgs/add-friend.svg'
import { ReactSVG } from "react-svg";


function ProfileInfo (props: any) {

    return (
        <div className='profile-info1'>
            <div className='profile-info1-left'>
                <div className='profile-img1'>
                    <div id='status'>
                      <span>{props.userData.userStatus}</span>
                      <div></div>
                    </div>
                    <img src={props.userData.avatar ? props.userData.avatar : '/src/imgs/user-img.png'} alt="user-img" />
                </div>
            </div>
            <div className='profile-info1-right'>
                <div className='profile-name-rank1'>
                    <div className='profile-name1'> {props.userData.username ? props.userData.username : 'hamid'} </div>
                    <div className='profile-rank1'> 5 </div>
                </div>
                <div className='profile-buttons'>
                    <ReactSVG src='/src/imgs/svg/add-user.svg' className="add-friend" />
                    <ReactSVG src='/src/imgs/svg/play-game.svg' className="play-game" />
                </div>
            </div>
        </div>
    )
}




function NotFriendProfile (props: any) {

  console.log('profile : ', props.userData)


    return (
        <div className='profile'>
                <ProfileInfo userData={props.userData[0]} />
        </div>
    )
}

export default NotFriendProfile;
