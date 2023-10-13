import NavBarTwo  from './navBarTwo'
import NavBarTree from './navBarTree';
import '../css/Section.css'
import Profile from './Profile';
import React, {useState, useEffect} from 'react';
import Leaderboard from './Leaderboard';


function selectSection(section: string): JSX.Element {

    console.log(section);
    if (section === 'profile')
        return ( <Profile />)
    else if (section === 'leaderboard')
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
                <Leaderboard />
                    {selectSection(props.section)}
                </div>
            </div>
        </div>
    ) 
}

export default Section;