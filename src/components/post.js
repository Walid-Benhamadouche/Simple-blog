import { useState, useRef } from 'react';
import { useMutation, gql } from '@apollo/client';

function Post(props) {
  const DELETE_POST = gql`
			mutation($id: ID!){
        deletePost(_id: $id)
      }
		`

  const UPDATE_POST = gql`
      mutation($id: ID!, $title: String, $content: String, $image: String){
        updatePost(_id: $id, title: $title, content: $content, img: $image){
          _id
          img
        }
      }
    `
  const ref = useRef(null)
  const [title, setTitle] = useState(props.title)
  const [content, setContent] = useState(props.content)
  const [image, setImage] = useState(props.image)
  const [edit, setEdit] = useState(false)
  const [deletePost] = useMutation(DELETE_POST, 
		{
		  onCompleted(data) {
      console.log(data)
      if(data)
      {
        console.log("inside")
        props.delPost(props.index)
      }
		}
	})

  const [upPost] = useMutation(UPDATE_POST,
    {
      onCompleted(data) {
        console.log(data)

        setEdit(false)
      }
    })

  const removePost = () =>{
    deletePost({ variables: { id: props.id } })
  }

  const updatePost = () =>{
    upPost({ variables: { id: props.id, title: title, content: content, image: image } })
  }

  return (
    <div className="ml-3 md:flex md:justify-around m-1">
      <div className='bg-white max-w-sm md:max-w-full rounded shadow-lg block md:flex md:justify-between w-80 md:w-[650px]'>
        <div className='p-3 md:p-0 md:m-5 w-full'>
        {!edit ?
          <div>
          <div>
            <p className="font-bold uppercase">{title}</p>
            <label>{content}</label>
            <img ref={ref} src={image}></img>
            <button className="bg-red-500 hover:bg-red-700 text-white mt-1 mr-1 py-1 px-1 rounded" onClick={removePost}>Delete</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white mt-1 mr-1 py-1 px-1 rounded" onClick={()=>{setEdit(true)}}>Edit</button>
          </div>
        </div>
        :
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Post Name</label >
            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " 
            defaultValue={title}
            type="text" onChange={(e) => setTitle(e.target.value)}/>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Task content
            </label >
            <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
             defaultValue={content}
            onChange={(e) => setContent(e.target.value)}/>
            <button className="bg-blue-500 hover:bg-blue-700 text-white mt-1 mr-1 py-1 px-1 rounded"
            onClick={updatePost}>Update Post</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white mt-1 mr-1 py-1 px-1 rounded"
             onClick={()=>setEdit(false)}>Cancel</button>
            <input className="text-sm text-grey-500
            file:mr-5 file:py-2 file:px-6
            file:rounded-full file:border-0
            file:text-sm file:bg-blue-500 
          file:text-white file:font-bold
            hover:file:cursor-pointer hover:file:bg-blue-700 
          hover:file:text-white hover:file:font-bold"
            type="file" accept="image/*" onChange={(e) => {
              const reader = new FileReader()
              reader.onloadend = (e) =>{
                setImage(e.target.result)
              }
            reader.readAsDataURL(e.target.files[0])
        }}/>
          </div>
        }
    </div>
    </div>
    </div>
  );
}

export default Post;
