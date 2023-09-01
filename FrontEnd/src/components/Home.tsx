
export default function Home() {

    const my_img:string = 'src/imgs/about.png'

    return (
        <>
            <main className="main-home" >
                <div className="dscp-home">
                    <div className="title">
                        <span className="title1"> MSKOTA </span>
                        <span className="title2"> LET'S PLAY<br /> <span className="tab">PINGPONG</span></span>
                    </div>
                    <div>
                        {/* <p className="comment">
                            <span className="tab1" /> Get ready to experience the thrill and excitement of one of the most beloved sports in the world.
                            Ping Pong! Our game takes this classic table tennis game to a whole new level, right in the comfort of your home.
                            <br /><br /> <span className="tab1" /> To Stay play with your friends .
                        </p> */}
                    </div>
                    {/* <button className="getStart-b">Get Started</button> */}
                </div>
                <div className='home-img' >
                    {/* <img  src={my_img} alt='home.png' /> */}
                </div>
            </main>
        </>
    )
}