import Home from './Home'
import About from './About'
import Developers from './Developers'
import Sign from './Sign' 
import NavBarOne from './navBarOne'
import Profile from './Profile'
import { Route, Routes, Navigate } from 'react-router-dom'
import '../css/App.css'
import Section from './Section'

import MyPieChart from './pieChart'

import Hlwa  from './pieChart'
import Draw from './Draw'

import { useAuth } from '../client/authContext'

function App()  {


  const { auth, updateAuth } = useAuth();
  // const history = useHistory();

    console.log('auth : ', auth)
    // console.log(auth)

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
            <Route path='/login' element={!auth ? <Sign tag='login' /> : <Navigate to='/' />} />
            <Route path='/signup' element={!auth ? <Sign tag='signup' /> : <Navigate to='/' />} />
            <Route path='/profile' element={<Section section='profile' />}  /> 
            <Route path='/leaderboard' element={<Section section='leaderboard' />}  /> 
            {/* <Route path='/zitona' element={<Zitona />} /> */} 
        </Routes>
    )
}

export default App;
