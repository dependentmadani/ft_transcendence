import '../css/Profile.css'
import MyPieChart from './pieChart'
import Myhlwa from './Test'


function ProfileInfo () {

    return (
        <>
        </>
    )
}

function Achivements() {

    return (
        <>
        </>
    )
}

function Frindes () {

    return (
        <>
        </>
    )
}

function Badges() {
  return (
    <div className="badge-history">
      <div className="players">
        <img id="player" src="src/imgs/example.jpg" alt="user" />
        <img id="vs-img" src="src/imgs/vs-.png" alt="VS" />
        <img id="player" src="src/imgs/example.jpg" alt="user-vs" />
        <div id="comma">
          <img src="src/imgs/comma.png" alt="comma" />
          <img src="src/imgs/comma.png" alt="comma" />
        </div>
      </div>
      <div className="score-match">
        <div className="score">
          <span>5</span>
          <span>3</span>
        </div>
      </div>
    </div>
  );
}

function Friend() {
    return (
        <div className='friend'>
            <img className='user-friend' src="src/imgs/example.jpg" alt="friend-img" />
            <span className='status-friend'><span id='circle'></span> status</span>
            <span className='name-friend'> Name</span>
            {/* <span className='icon-chat'></span> */}
            <img className='icon-chat' src="src/imgs/chat-room.png" alt="chat-img" />
        </div>
    )
}

function History () {
    return (
        <>
        </>
    )
}


function Profile () {

    return (
        <div className='profile'>
            <div className='profile-col-1'>
                <div className='profile-info'>
                    <div className='profile-info-left'>
                        <img id='settings'  src="src/imgs/setting.png" alt="setting" />
                        <div className='profile-img'>
                            <img src="src/imgs/example.jpg" alt="user-img" />
                        </div>
                        <div className='profile-name-rank'>
                            <span className='profile-name'> Name </span>
                            <span className='profile-rank'> 5 </span>
                        </div>
                    </div>
                    <div className='profile-info-right'>
                        <div id='title' >
                            <span>Achivements</span>
                        </div>
                        <div className='achivements'>
                            <div className='achive'></div>
                            <div className='achive'></div>
                            <div className='achive'></div>
                            <div className='achive'></div>
                            <div className='achive'></div>
                            <div className='achive'></div>
                            <div className='achive'></div>
                            <div className='achive'></div>
                            <div className='achive'></div>
                        </div>
                    </div>
                </div>
                <div className='user-friends'>
                    <div id='search'>
                        <img src="/src/imgs/search.png" alt="search" />
                    </div>
                    {/* <input type="text" className="search-input" placeholder="Search..." /> */}
                    <div id='title' ><span>Friends </span></div>
                    <div className='friends-list'>
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                    </div>

                </div>
            </div>
            <div className='profile-col-2'>
                <div className='history'>
                    <div id='title' ><span>History </span></div>
                    <div className='my-history'>
                        
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        <Badges />
                        </div>        

                </div>
                <div className='statistic'>
                    <div id='title' ><span>Statistic </span></div>
                    <div id='chart'>
                        <MyPieChart />
                    </div>
                </div>
            </div>
            {/* <div className='blur' ></div>
            <div className='popup'></div> */}
        </div>
    )
}

export default Profile;

<div className='hlwa'>
    <div className='hlaw1'></div>
    <div className='hlaw2'></div>
</div>