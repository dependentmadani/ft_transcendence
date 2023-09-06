
export default function Home() {

    const my_img:string = 'src/imgs/home.png'

    return (
        <>
            <main className="main-home" >
                <div>
                    <div>
                        <h1> MSKOTA </h1>
                        <h2> LET'S PLAY PINGPONG</h2>
                        <p></p>
                    </div>
                </div>
                <div>
                    <img src={my_img} alt='home.png' />
                </div>
            </main>
            <button>Get Started</button>
        </>
    )
}