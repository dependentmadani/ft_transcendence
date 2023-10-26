import  { useState, KeyboardEventHandler, useEffect } from 'react';
import axios from 'axios';
import './searchFriend.css'

function Friends_list(props:any) {

	if (!props.data)
		return (<span id='no_friend' >No Friends ...</span>)
	const friends =	props.data.map(friend => {
		return (
			<div key={friend.id} className='friend'>
				<img className='user-friend' src={friend.avatar} alt="friend-img" />
				<span className='status-friend'><span id='circle'></span> friend.userStatus </span>
				<span className='name-friend'> friend.username </span>
				{/* <span className='icon-chat'></span> */}
				<img className='icon-chat' src="/src/imgs/chat-room.png" alt="chat-img" />
			</div>
		)
	})

    return (friends)
}

function Friends (props: any) {

    const [data, setData] = useState(props.listFriend);
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

    const getFriends = (target:string) => {
        if (target === '')
            setData(props.listFriend);
        else {
            // serach
        }
    }

    const handleKey: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            const _input = document.querySelector('.search-input') as HTMLInputElement
            console.log(_input.value)
			// getFriends(target);
        }
    }

    return (
        <div className='user-friends'>
            <div className='search-bar'>
                <input type="text" className="search-input" 
                    placeholder="Search..." 
                    // value={target}
                    // onKeyDown={handleKey}
                    onKeyDown={handleKey}
                    onFocus={() => {setIconSearch('/src/imgs/cancel-red.png')}}
                    onBlur={() => { my_search.value = ''; setIconSearch('/src/imgs/search.png')}}
                />
                <img id='search' src={iconSearch} alt="search"  onClick={search_open}/>
            </div>
            <div id='title' >
                <span>Friends </span>
            </div>
            <div className='friends-list'>
                <Friends_list data={data} />
            </div>
        </div>
    )
}

export default Friends;