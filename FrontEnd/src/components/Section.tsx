import Home from './Home'
import About from './About'
import Developers from './Developers'
import { Route, Routes } from 'react-router-dom'


function Section(props:any)  {
    
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/developers' element={<Developers />} />
        </Routes>
    )
}

export default  Section;