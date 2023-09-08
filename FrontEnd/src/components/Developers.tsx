import '../css/Developers.css'
import badgeData from '../data/badgeData'

function Badges() {

    const badges = badgeData.map(badge => {

        let nameclass:string = 'badge' 

        return (
            <div className={nameclass}>
                <img src={badge.img} alt="person-img" /> 
                <div className='portfolio'>
                    <p>{badge.name}</p>
                    <div className='follow'>
                        <a href={badge.github}> 
                            <img src="src/imgs/github.png" alt="github-logo" /> 
                        </a>
                        <a href={badge.linkedin}>
                            <img src="src/imgs/linkedin.png" alt="linkedin-logo" />
                        </a>
                        <a href={badge.intra42}>
                            <img src="src/imgs/42.png" alt="42-logo" />
                        </a>
                    </div>
                </div>
            </div>
        )
    })



    return (
        <>
            {badges}
        </>
    )
}


function Developers() {

    const my_img:string = 'src/imgs/developers.png'

    return (
        <main className="main-dev" >    
            <div className="dscp-dev">
                <Badges />
            </div>
            <div className='dev-img' >
                 <img  src={my_img} alt='home.png' />
            </div>
        </main>
    )
}

export default Developers;