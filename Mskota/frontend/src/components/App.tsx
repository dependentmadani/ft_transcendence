
import { Route, Routes, Navigate } from 'react-router-dom'
import '../css/App.css'
import Section from './Section'
import DefaultSection from './defaultSection' 
import Sign from './Sign' 
import Profile from './Profile'
import { useAuth } from '../client/authContext'
import { useClient } from '../client/clientContext'
import { useEffect } from 'react'
import axios from 'axios'
// import Test from './Test'

function App()  {


  const { client, updateClient } = useClient();

    return (
        <Routes>
            <Route path='/' element={
                (client.signedIn && !client.signedUp) ? <Sign tag='signup' /> : 
                <DefaultSection section='home' />
              } 
            />
            <Route path='/about' element={
              (client.signedIn && !client.signedUp) ? <Sign tag='signup' /> : 
              <DefaultSection section='about' />
            } 
            />
            <Route path='/developers' element={
                (client.signedIn && !client.signedUp) ? <Sign tag='signup' /> : 
                <DefaultSection section='developers' />
              } 
            />
            <Route path='/login' element={
              !client.signedIn ? <Sign tag='login' /> : 
              !client.signedUp ?  <Navigate to='/signup'  /> :
              <Navigate to='/'  />
              // <Sign tag='login' />
            } />
            <Route path='/signup' element={
              !client.signedIn ? <Navigate to='/login'  /> : 
              !client.signedUp ?  <Sign tag='signup' /> :
              <Navigate to='/'  />
              // <Sign tag='signup' />
            } />

            <Route path='/profile' element={
              !client.signedIn ? <Navigate to='/login'  /> : 
              !client.signedUp ?  <Navigate to='/signup'  /> :
              <Section section='profile' /> 
            } /> 
            <Route path='/leaderboard' element={
              !client.signedIn ? <Navigate to='/login'  /> : 
              !client.signedUp ?  <Navigate to='/signup'  /> :
              <Section section='leaderboard' />
            }/> 
            {/* <Route path='*' element={<NotFound />}  />  */}
            {/* <Route path='/test' element={<Test />} /> */}
        </Routes>
    )
}

export default App;
