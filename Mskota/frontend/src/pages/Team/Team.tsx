import './Team.css'


const badgeData = [
    {
        id: 1,
        img: 'https://avatars.githubusercontent.com/u/97313235?v=4',
        intraImg: 'https://cdn.intra.42.fr/users/c14187d839123d0a18a7d10425b4b761/mait-jao.jpg',
        name: 'Mohamed Ait Jaouad',
        github: 'https://github.com/Koru-zed',
        linkedin: 'https://www.linkedin.com/in/mohamed-ait-jaouad-a31b14237/',
        intra42: 'https://profile.intra.42.fr/users/mait-jao' 
    },
    {
        id: 2,
        img: 'https://avatars.githubusercontent.com/u/47648515?v=4',
        intraImg: 'https://cdn.intra.42.fr/users/cb133d92681108cde8b84b0af713edde/mbadaoui.jpg',
        name: 'Madani Badaoui',
        github: 'https://github.com/dependentmadani',
        linkedin: 'https://www.linkedin.com/in/madani-badaoui/',
        intra42: 'https://profile.intra.42.fr/users/mbadaoui' 
    },
    {
        id: 3,
        img: 'https://avatars.githubusercontent.com/u/94312066?v=4',
        intraImg: 'https://cdn.intra.42.fr/users/77c2360d92f613f5d5a896d570b5924f/ael-asri.jpg',
        name: 'Abderrahman El Asri',
        github: 'https://github.com/stronk-exe',
        linkedin: 'https://www.linkedin.com/in/abderrahman-el-asri-087b90206/',
        intra42: 'https://profile.intra.42.fr/users/ael-asri' 
    },
    {
        id: 4,
        img: 'https://avatars.githubusercontent.com/u/85410199?v=4',
        intraImg: 'https://cdn.intra.42.fr/users/7f9f7f1cc452e81c0dedb738c86c79ea/sriyani.jpg',
        name: 'Said Riyani',
        github: 'https://github.com/khalidsr',
        linkedin: 'https://www.linkedin.com/in/said-riyani-4b174a194/',
        intra42: 'https://profile.intra.42.fr/users/sriyani' 
    },
    {
        id: 5,
        img: 'https://avatars.githubusercontent.com/u/85259775?v=4',
        intraImg: 'https://cdn.intra.42.fr/users/e9525e5ce9a638241973abc463a14a8f/zihihi.jpg',
        name: 'Zakaria Ihihi',
        github: 'https://github.com/e-zaki',
        linkedin: 'https://www.linkedin.com/in/zakaria-ihihi-2b566220b/',
        intra42: 'https://profile.intra.42.fr/users/zihihi' 
    }
]

function Badges() {

    const badges = badgeData.map(badge => {


        return (
            <div className='badge' >
                <img src={badge.img} alt="person-img"  className='team-img'/> 
                <div className='portfolio'>
                    <p>{badge.name}</p>
                    <div className='follow'>
                        <a href={badge.intra42}>
                            <img src="src/imgs/42.png" alt="42-logo" />
                        </a>
                        <a href={badge.github}> 
                            <img src="src/imgs/github.svg" alt="github-logo" /> 
                        </a>
                        <a href={badge.linkedin}>
                            <img src="src/imgs/linkedin.png" alt="linkedin-logo" />
                        </a>
                    </div>
                </div>
            </div>
        )
    })



    return (
        <div className='badges'>
            {badges}
        </div>
    )
}


function Team() {

    const my_img:string = 'src/imgs/developers.png'

    return (
        <main className="main-dev" >    
            <div className="dscp-dev">
                <Badges />
                {/* <Badges /> */}
            </div>
            <div className='project-tools'>

            </div>
        </main>
    )
}

export default Team;