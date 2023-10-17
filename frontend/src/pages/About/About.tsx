import './About.css'


export default function About() {
    const my_img:string = '@/imgs/about.png'

    return (
        <>
            <main className="main-home" >
                <div className="dscp-home">
                    <p className="comment">
                        <span className="tab1" /> Get ready to experience the thrill and excitement of one of the most beloved sports in the world.
                        Ping Pong! Our game takes this classic table tennis game to a whole new level, right in the comfort of your home.
                        <br /><br /> <span className="tab1" /> To Stay play with your friends .
                    </p>
                </div>
                <div className='home-img' >
                    <img  src={my_img} alt='home.png' />
                </div>
            </main>
        </>
    )
}