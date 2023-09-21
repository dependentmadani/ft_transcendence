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

                </div>
                <div className='user-friends'>

                </div>
            </div>
            <div className='profile-col-2'>
                <div className='history'>

                </div>
                <div className='statistic'>
                    <MyPieChart />
                        {/* <Myhlwa/> */}
                </div>
            </div>
            
        </div>
    )
}

export default Profile;