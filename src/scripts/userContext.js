import { createContext } from 'react';

const userContext = createContext({user: null, setUser: ()=>{}})
const loggedContext = createContext({logged: false, setLogged: ()=>{}})
export {userContext, loggedContext}