
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
  // const { auth, updateAuth } = useAuth();
  // const history = useHistory();

    useEffect(() => {
      console.log('data client ')
      console.log(client)
    }, [client])

    useEffect(() => {
      const fetchdata = async() => {
        try {
          await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/logged_in`, 
            { withCredentials: true })
          updateClient({...client, signedIn: true})
          try {
            const res = await axios.get(`http://${import.meta.env.VITE_BACK_ADDRESS}/auth/me`, 
              { withCredentials: true })
              // console.log(res.data)
              // if (res.data)
            await updateClient({...client, ...res.data})
          } catch (err) {    
            console.log('Did not SignUp yet! :)');
          }
        } catch (err) {    
          console.log('Did not login yet! :)');
        }
      }
      
      fetchdata();
    }, [])

    console.log('zzzzzzzzzzzzzzzzzzzzzz')

    // console.log('auth : ', auth)
    // console.log(auth)

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
              !client.signedUp ?  <Sign tag='signup' /> :
              <Navigate to='/'  />
            } />
            <Route path='/signup' element={
              !client.signedIn ? <Sign tag='login' /> : 
              !client.signedUp ?  <Sign tag='signup' /> :
              <Navigate to='/'  />
            } />

            <Route path='/profile' element={
              !client.signedIn ? <Sign tag='login' /> : 
              !client.signedUp ?  <Sign tag='signup' /> :
              <Section section='profile' /> 
            } /> 
            <Route path='/leaderboard' element={
              !client.signedIn ? <Sign tag='login' /> : 
              !client.signedUp ?  <Sign tag='signup' /> :
              <Section section='leaderboard' />
            }/> 
            {/* <Route path='*' element={<NotFound />}  />  */}
            {/* <Route path='/test' element={<Test />} /> */}
        </Routes>
    )
}

export default App;
