import './Team.css'
import { ReactSVG } from "react-svg";


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
            <div key={badge.id} className='badge' >
                <img src={badge.img} alt="person-img"  className='team-img'/> 
                <div className='portfolio'>
                    <span>{badge.name}</span>
                    <div className='follow'>
                        <a href={badge.intra42}>
                            <ReactSVG src="/src/imgs/svg/42_Logo.svg" className='contact'  />
                        </a>
                        <a href={badge.github}> 
                            <ReactSVG src="/src/imgs/svg/github.svg"  className='contact' />
                        </a>
                        <a href={badge.linkedin}>
                            <ReactSVG src='/src/imgs/svg/linkedin.svg' className='contact' />
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

const Tools = () => {
    return (
        <div  className='tools'>
            <img src='/src/imgs/svg/nodejs.svg' className='tool' />
            <img src='/src/imgs/svg/npm.svg' className='tool' />
            <img src='/src/imgs/svg/vite.svg' className='tool' />
            <img src='/src/imgs/svg/typescript.svg' className='tool' />
            <img src='/src/imgs/svg/css.svg' className='tool' />
            <img src='/src/imgs/svg/react-.svg' className='tool' />
            <img src='/src/imgs/svg/nestjs.svg' className='tool' />
            <img src='/src/imgs/svg/prisma.svg' className='tool' />
            <img src='/src/imgs/svg/docker.svg' className='tool' />
        </div> 
    )
}


function Team() {

    const my_img:string = 'src/imgs/developers.png'

    return (
        <main className="main-dev" >    
            <div className="dscp-dev">
                <Badges />
                <Badges />
            </div>
            <div className='main-project-tools'>
                <p> Languages & Technologies </p>
                <div className='project-tools'>
                    <Tools />
                    <Tools />
                </div>
            </div>
        </main>
    )
}

export default Team;