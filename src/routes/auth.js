import {useState, useContext} from 'react';
import { useLazyQuery, useMutation, gql, ApolloConsumer, createHttpLink } from '@apollo/client';
import {
  useNavigate,
} from "react-router-dom";
import { userContext } from '../scripts/userContext';
import { createUploadLink } from "apollo-upload-client"

const LOG_IN = gql`
	query ($email: String!, $password: String!){
		logIn(email: $email, password: $password)
	}
`

const SIGN_UP = gql`
	mutation ($email: String!, $password: String!, $name: String!){
		signUp(email: $email, password: $password, name: $name)
	}
`

function Auth() {
	var clientv = ''
	const navigate = useNavigate()
	const {user, setUser} = useContext(userContext);
	const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [Cpassword, setCPassword] = useState("")
  const [name, setName] = useState("")
	const [Semail, setSEmail] = useState("")
  const [Spassword, setSPassword] = useState("")
	const [logIn, { loading, error, data }] = useLazyQuery(LOG_IN)
	const [signUp] = useMutation(SIGN_UP, {
		onCompleted(data) {
			localStorage.setItem('user', data.signUp)
			window.location.reload();
		}
	})
	
	
	if(data) {
		localStorage.setItem('user', data.logIn)
    navigate('/home')
		//////////// reload should be avoided and replaced by a getUser request here////////////////
		window.location.reload();
	}
	return (
    <ApolloConsumer>
      {(client) => {
  return (
        <div className="sm:flex sm:justify-center">
            <div className="mt-5 ml-3 md:flex m-1">
                <div className='bg-white max-w-sm md:max-w-full rounded shadow-lg block md:flex md:justify-between w-80 md:w-96'>
                    <form className='p-3 md:p-0 md:m-5 w-full'>
                        <h1 className="font-bold text-xl text-center">Log In</h1>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            E-mail
                        </label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"></input>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 py-2 px-2 rounded"
                        onClick={(e) => {
												e.preventDefault();
												logIn({variables: {email: email, password: password}}).then(()=>{
													client.setLink(
														createUploadLink({
															uri: 'http://localhost:4000/graphql/',
															headers: {
																authorization: localStorage.getItem('user'),
															},
															credentials: 'include'
														})
													)
													setUser(null)
													
												})
												}}>
                        Log In
                        </button>
                    </form>
                </div>
            </div>
            <div className="mt-5 ml-3 md:flex m-1">
                <div className='bg-white max-w-sm md:max-w-full rounded shadow-lg block md:flex md:justify-between w-80 md:w-96'>
                    <form className='p-3 md:p-0 md:m-5 w-full'>
                        <h1 className="font-bold text-xl text-center">SignUp</h1>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Name
                        </label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"></input>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            E-mail
                        </label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        type="text" value={Semail} onChange={(e) => setSEmail(e.target.value)} placeholder="E-mail"></input>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        type="password" value={Spassword} onChange={(e) => setSPassword(e.target.value)} placeholder="Password"></input>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Confirm password
                        </label>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        type="password" value={Cpassword} onChange={(e) => setCPassword(e.target.value)} placeholder="confirm password"></input>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white m-2 py-2 px-2 rounded"
                        onClick={(e) => {
													e.preventDefault();
													console.log(clientv)
													signUp({variables: {email: Semail, password: Spassword, name: name}}).then(()=>{
														console.log(clientv)
														client.setLink(
															createHttpLink({
																uri: 'http://localhost:4000/graphql/',
																headers: {
																	authorization: localStorage.getItem('user'),
																},
																credentials: 'include'
															})
															)
															setUser(null)
															navigate('/home')
													})
													}}>
                            Sign up
                        </button>
                    </form>
                </div>
            </div>
        </div>		
  );
}}
</ApolloConsumer>
)}

export default Auth;
