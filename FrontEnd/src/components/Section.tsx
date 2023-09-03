import Home from './Home'
import About from './About'
import Developers from './Developers'


function Section(props:any)  {
    
    return (
        <>
            {props.selectedSection === 'Home' && <Home />}
            {props.selectedSection === 'About' && <About />}
            {props.selectedSection === 'Developers' && <Developers devs-data='' />}
        </>
    )
}

export default  Section;