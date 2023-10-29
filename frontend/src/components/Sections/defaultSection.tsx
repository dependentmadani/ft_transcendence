import NavBarOne from '@/components/NavBars/NavBarOne/navBarOne'
import Home from '@/pages/Home/Home'
import About from '@/pages/About/About'
import Team from '@/pages/Team/Team'
import { Navigate } from 'react-router-dom'

function selectSection(section: string): JSX.Element {

    if (section === '/home' || section === '/')
        return ( <Home />)
	else if (section === '/about')
        return ( <About />)
	else if (section === '/team')
        return ( <Team />)
        
    return <Navigate to='/' />
}

function DefaultSection(props: any) {

    console.log('Yyyyyyyyyyyyyyyyyyyyy');

	return (<>
        <NavBarOne />
		{selectSection(props.section)}
	</>)
}

export default DefaultSection;