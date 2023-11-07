import './searchFriend.css'
import  { useState, useEffect, KeyboardEventHandler } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useClient } from '@/context/clientContext';

function Friends_list(props:any) {

    let friends;
    // const {client} = useClient();
    const navigate = useNavigate();
        console.log('hna : ', props.friendsData)
        console.log('target : ', props.target)
    // console.log('********', client)

	if (!props.friendsData.length)
		return (<span className='no-users'> No friends .... </span>)

    if (!props.target) {
        console.log('natija 1: ')
        friends =	props.friendsData.map(friend => {

            let statusColor = '';
            if (friend.userStatus === 'ONLINE') 
                statusColor = 'springgreen';
            else if (friend.userStatus === 'OFFLINE') 
                statusColor = 'red';
            else 
                statusColor = '#15a3e9';

            return (
                <div key={friend.id} className='friend'>
                    <img className='user-friend' src={friend.avatar} alt="friend-img" onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} onClick={() => {navigate(`/profile/${friend.username}`)}} />
                    <span className='status-friend'><span id='circle' style={{ background: statusColor }} ></span> {friend.userStatus} </span>
                    <span className='name-friend'> {friend.username} </span>
                    <img className='icon-chat' src="/src/imgs/chat-room.png" alt="chat-img" />
                </div>
            )
        })
    }
    else {
        console.log('natija 2: ')
        friends =	props.friendsData.filter(friend => friend.username.toLowerCase().startsWith(props.target.toLowerCase()))
        .map(friend => {

            let statusColor = '';
            if (friend.userStatus === 'ONLINE') 
                statusColor = 'springgreen';
            else if (friend.userStatus === 'OFFLINE') 
                statusColor = 'red';
            else 
                statusColor = '#15a3e9';

            return (
                <div key={friend.id} className='friend'>
                    <img className='user-friend' src={friend.avatar} alt="friend-img" onError={(e) => { e.target.src = '/src/imgs/user-img.png'; }} onClick={() => {navigate(`/profile/${friend.username}`)}} />
                    <span className='status-friend'><span id='circle' style={{ background: statusColor }} ></span> {friend.userStatus} </span>
                    <span className='name-friend'> {friend.username} </span>
                    <img className='icon-chat' src="/src/imgs/chat-room.png" alt="chat-img" />
                </div>
            )
        })
    }

    return (friends)
}

function Friends (props:any) {

    // let friendData = props.friendData;
    const [searchOpen, setSearchOpen] = useState(false);
    const [target, setTarget] = useState('');
    const [iconSearch, setIconSearch] = useState('/src/imgs/search.png');
    


    const my_search = document.querySelector('.search-input') as HTMLInputElement
    const input = document.getElementById('search');

    console.log(my_search)
    const search_open = () => {
        console.log('searchOpen : ', searchOpen)
        if (!searchOpen) {
            setIconSearch('/src/imgs/cancel-red.png');
            my_search.focus()
        }
        else if (searchOpen) { 
            setIconSearch('/src/imgs/search.png');
            my_search.blur();
            my_search.value = '';
        }
        setSearchOpen(!searchOpen);
    }


    const handleKey: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            const _input = document.querySelector('.search-input') as HTMLInputElement
            console.log(_input.value)
            setTarget(_input.value.trim());
			// getFriends(_input.value);
        }
    }

    console.log('friends : ', props.friendsData)

    return (
        <div className='user-friends'>
            <div className='search-bar'>
                <input type="text" className="search-input" 
                    placeholder="Search..." 
                    onKeyDown={handleKey}
                    onFocus={() => {setIconSearch('/src/imgs/cancel-red.png')}}
                    onBlur={() => { my_search.value = ''; setTarget('') ; setIconSearch('/src/imgs/search.png')}}
                />
                <img id='search' src={iconSearch} alt="search"  onClick={search_open}/>
            </div>
            <div id='title' >
                <span>Friends </span>
            </div>
            <div className='friends-list'>
                <Friends_list friendsData={props.friendsData} target={target} />
            </div>
        </div>
    )
}

export default Friends;