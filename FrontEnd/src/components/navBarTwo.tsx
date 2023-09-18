import '../css/navBarTwo.css'




function NavBarTwo (props:any) {

    return ( 
        <>
            <img className='logo-img'  src="src/imgs/logo.png" alt="Mskota-logo" />
            <div className='right-bar'>
                <img className='notification' src="src/imgs/notification.png" alt="Notification" />
                <div className='mini-badge'>
                    <img id='user-img' src="src/imgs/user.jpg" alt="user-img" />
                    <p>Name</p>
                    <img id='drop-down' src="src/imgs/drop-down.svg" alt="drop=down" />
                </div>
            </div>
        </>
    )

}


export default NavBarTwo;