import NavBarTwo  from './navBarTwo'
import NavBarTree from './navBarTree';
import '../css/Section.css'
import Profile from './Profile';


function selectSection(section: string): JSX.Element {

    if (section === 'profile')
        return ( <Profile />)
    else if (section === 'profile')
        return ( <Profile />)
    else if (section === 'profile')
        return ( <Profile />)
    else if (section === 'profile')
        return ( <Profile />)
    else if (section === 'profile')
        return ( <Profile />)
    else if (section === 'profile')
        return ( <Profile />)
    else if (section === 'profile')
        return ( <Profile />)
    return <></>
}

function Section (props:any) {

    return (
        <div className='root-section'>
            <div className='NavBarTwo'>
                {/* hlwa */}
                <NavBarTwo/>
            </div>
            <div className='main-section'>
                <div className='NavBarTree'>
                    <NavBarTree/>
                </div>
                <div className='select-section'>
                    {selectSection(props.section)}
                </div>
            </div>
        </div>
    ) 
}

export default Section;