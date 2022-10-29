import {useEffect, useContext, useState} from 'react';
import { userContext, loggedContext } from '../scripts/userContext'
import { useQuery, gql, ApolloConsumer, createHttpLink  } from '@apollo/client';
import { createUploadLink } from "apollo-upload-client"
import Post from '../components/post';
import AddPost from '../components/addPost';
import {
  useNavigate,
} from "react-router-dom";

const GET_POSTS = gql`
	query{
  user{
    posts{
      _id
      userID
      title
      content
      img
    }
  }
}
`

function Home() {
  const navigate = useNavigate()
	const {logged, setUsert} = useContext(loggedContext)
  const {user, setUser} = useContext(userContext);
  const {loading: loading, error: error, data: data} = useQuery(GET_POSTS)
  //let posts = []

  const [posts, setPosts] = useState([])

  //console.log(user.photoURL)
  const addPost = (newPost) => {
    let postsTemp = [...posts]
    console.log(newPost)
    postsTemp.unshift(newPost)
    setPosts(postsTemp)
  }

  const updatePost = (index, updatedPost) =>{
    let postsTemp = [...posts]
    postsTemp.splice(index, 1, updatedPost)
    setPosts(postsTemp)
  }

  const deletePost = (index) =>{
    let postsTemp = [...posts]
    postsTemp.splice(index,1)
    setPosts(postsTemp)
  }

  useEffect(() => {
    if(data) setPosts(data.user.posts)
  }, [data])

  return (
    <ApolloConsumer>
      {(client) => {
        return(
          <div>
            <nav className="bg-white border-gray-200 px-1 py-1 rounded">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                  <span className="ml-1 text-lg">{user.name}</span>
                </div>
                
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mr-1 py-2 px-2 rounded" 
                  onClick={() =>{
                    localStorage.removeItem('user');
                    client.setLink(
                      createUploadLink({
                        uri: 'http://localhost:4000/graphql/',
                        credentials: 'include'
                      })
                    )
                    client.clearStore()
                    setUser(null)
                    navigate('/auth')
                  }}>Log out</button>
              </div>
            </nav>
            <AddPost pushPost={addPost}/>
            {posts.map((object, i) =>
            <Post
              id={object._id}
              key={object._id}
              title={object.title}
              content={object.content}
              image={object.img}
              index={i}
              upPost={updatePost}
              delPost={deletePost}
            />)}
          </div>
        )
      }}
    </ApolloConsumer>
    
  );
}

export default Home;
