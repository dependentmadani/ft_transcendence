import '../css/navBar.css'


function NavBar(props:any) {
    
    const my_img:string = 'src/imgs/logo.png'

    const handleItemClick = (section:string) => {
        props.onSectionChange(section);
    };

    return (
        <>
            <nav className="bar">
                <img className="logo" src={my_img} alt='Mskota-Logo' onClick={() => handleItemClick("Home")} />
                <div className="list">
                    <ul>
                        <li onClick={() => handleItemClick("Home")} > Home </li>
                        <li onClick={() => handleItemClick("About")} > About </li>
                        <li onClick={() => handleItemClick("Developers")} > Developers </li>
                    </ul>
                </div>
                <div></div>
            </nav>
        </>
    )
}

export default  NavBar;