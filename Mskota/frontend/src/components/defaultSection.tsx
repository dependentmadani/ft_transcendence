import NavBarOne from './navBarOne'
import Home from './Home'
import About from './About'
import Developers from './Developers'
import { Navigate } from 'react-router-dom'

function selectSection(section: string): JSX.Element {

    if (section === 'home')
        return ( <Home />)
	else if (section === 'about')
        return ( <About />)
	else if (section === 'developers')
        return ( <Developers />)
    else 
        <Navigate to='/' />
    return <></>
}

function DefaultSection(props: any) {

	return (<>
        <NavBarOne />
		{selectSection(props.section)}
	</>)
}

export default DefaultSection;