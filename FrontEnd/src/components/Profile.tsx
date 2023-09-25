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
                    <div className='profile-info-right'>
                        {/* <img id='settings'  src="src/imgs/setting.png" alt="setting" />
                        <div className='profile-img'>
                            <img src="src/imgs/example.jpg" alt="user-img" />
                        </div>
                        <div className='profile-name-rank'>
                            <span className='profile-name'> Name </span>
                            <span className='profile-rank'> 5 </span>
                        </div> */}
                    </div>
                    <div className='profile-info-left'>

                    </div>
                </div>
                <div className='user-friends'>

                </div>
            </div>
            <div className='profile-col-2'>
                <div className='history'>
                    {/* <Badges />
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
                    <Badges />
                    <Badges />
                    <Badges />
                    <Badges />
                    <Badges /> */}

                </div>
                <div className='statistic'>
                    {/* <MyPieChart /> */}
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