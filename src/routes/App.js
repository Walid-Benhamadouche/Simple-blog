import { useState, useEffect } from 'react';
import { userContext, loggedContext } from '../scripts/userContext'
import { useLazyQuery, gql } from '@apollo/client';
import Auth from './auth';
import Home from './home'
import {
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";

const GET_USER = gql`
	query{
  user{
	_id
    email
    name
  }
}
`

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [logged, setLogged] = useState(false);
  const [signIn, {loading: loading, error: error, data: data}] = useLazyQuery(GET_USER)

  useEffect(() => {
    signIn()
    if (data) {
      console.log(data.user)
      if(data.user)
      {
        setUser(data.user)
        navigate('/home')
      }
    } else {
      setUser(data)
      navigate('/auth')
    }
  },[data]);

  return (
    <userContext.Provider value={{user, setUser}}>
      <loggedContext.Provider value={{logged, setLogged}} >
        <div className="App bg-gray-100 min-h-screen min-w-screen">
        {!loading && !user ?
            <Routes>
              <Route path="/auth" element={<Auth />}/>
            </Routes>
            :
            <Routes>
              <Route path="/home" element={<Home />}/>
            </Routes>}
        </div>
      </loggedContext.Provider>
    </userContext.Provider>
  );
}

export default App;