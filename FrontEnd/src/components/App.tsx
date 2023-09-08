import Home from './Home'
import About from './About'
import Developers from './Developers'
import Login from './Login'
import NavBarOne from './navBarOne'
import { Route, Routes } from 'react-router-dom'
import '../css/App.css'


function App(props:any)  {
    
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
            <Route path='/login' element={<Login />} />
        </Routes>
    )
}

export default App;
