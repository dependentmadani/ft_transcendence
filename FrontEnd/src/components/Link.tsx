import Home from './Home'
import About from './About'
import Developers from './Developers'


// type page = {
//     link:string
//     comp: string
// }

export default function Link(props:any) : JSX.Element  {

    let Component:JSX.Element

    if (props.comp === 'About')        Component = <About />  
    else if (props.comp === 'Developers')   Component = <Developers />
    else                                    Component = <Home />
    
    return (
        <>
            {Component}
        </>
    )
}