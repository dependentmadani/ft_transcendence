import NavBarOne from '@/components/NavBars/NavBarOne/navBarOne'
import Home from '@/pages/Home/Home'
import About from '@/pages/About/About'
import Developers from '@/pages/Team/Developers'
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