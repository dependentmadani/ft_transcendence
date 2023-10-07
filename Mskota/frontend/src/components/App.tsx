import Home from './Home'
import About from './About'
import Developers from './Developers'
import SignUp from './SignUp' 
import Login from './Login'
import NavBarOne from './navBarOne'
import Profile from './Profile'
import { Route, Routes } from 'react-router-dom'
import '../css/App.css'
import Section from './Section'

import MyPieChart from './pieChart'

import Hlwa  from './pieChart'
import Draw from './Draw'

function App()  {


    return (
        <Routes>
            <Route path='/' element={<>
                <NavBarOne />
                <Home /> </>} 
            />
            <Route path='/about' element={<>
              <NavBarOne />
              <About /></>} 
            />
            <Route path='/developers' element={<>
              <NavBarOne />
              <Developers /></>} 
            />
            <Route path='/login' element={<Login tag='login' />} />
            <Route path='/signup' element={<Login tag='signup' />} />
            <Route path='/profile' element={<Section section='profile' />} />
            <Route path='/pie' element={<MyPieChart />} />
            <Route path='/hlwa' element={<Hlwa />} />
            <Route path='/kika' element={<Draw />} />
            
            {/* <Route path='/zitona' element={<Zitona />} /> */} 
        </Routes>
    )
}

export default App;
