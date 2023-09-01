
export default function NavBar() {
    
    const my_img:string = 'src/imgs/logo.png'

    return (
        <>
            <nav className="bar">
                <img className="logo" src={my_img} alt='Mskota-Logo' />
                <div className="list">
                    <ul>
                        <li> Home </li>
                        <li> About </li>
                        <li> Developers </li>
                    </ul>
                </div>
                <div></div>
            </nav>
        </>
    )
}