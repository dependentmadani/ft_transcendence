import NavBarTwo  from './navBarTwo'
import NavBarTree from './navBarTree';
import '../css/Section.css'
import Profile from './Profile';
import React, {useState, useEffect} from 'react';


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

    useEffect(() => {
        const sourceElement = document.querySelector('.NavBarTwo') as HTMLElement;
        console.log(sourceElement.offsetHeight)
      }, []);

    return (
        <div className='root-section'>
                {/* hlwa */}
                <NavBarTwo/>
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