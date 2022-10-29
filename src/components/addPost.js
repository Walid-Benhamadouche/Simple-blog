import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

function AddPost(props) {
	const CREATE_POSTS = gql`
			mutation ($title: String!, $content: String!, $img: Upload){
				createPost(title: $title, content: $content, img: $img){
					_id
					#img
				}
			}
		`

	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [image, setImage] = useState(null)
	const [addPost] = useMutation(CREATE_POSTS,
		{
			onError(error) {
				console.log(JSON.stringify(error, null, 2))
			},
			onCompleted(data) {
				const post = {
					_id: data.createPost._id,
					title: title,
					content: content,
					//img: data.createPost.img
				}
				setTitle("")
				setContent("")
				props.pushPost(post)
			}
		})

	const addPostF = () => {
		console.log("image", image)
		addPost({ variables: { title: title, content: content, img: image } })
	}

	return (
		<div className="ml-3 md:flex md:justify-around m-1">
			<div className='bg-white max-w-sm md:max-w-full rounded shadow-lg block md:flex md:justify-between w-80 md:w-[650px]'>
				<div className='p-3 md:p-0 md:m-5 w-full'>
					<label className="block mb-2 text-sm font-medium text-gray-900">Post Name</label >
					<input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
						value={title}
						type="text" onChange={(e) => setTitle(e.target.value)} />
					<label className="block mb-2 text-sm font-medium text-gray-900">
						Post content
					</label >
					<textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
						value={content}
						onChange={(e) => setContent(e.target.value)} />
					<input className="text-sm text-grey-500
    	file:mr-5 file:py-2 file:px-6
        file:rounded-full file:border-0
        file:text-sm file:bg-blue-500 
		file:text-white file:font-bold
        hover:file:cursor-pointer hover:file:bg-blue-700 
        hover:file:text-white hover:file:font-bold"
						type="file" accept="image/*" onChange={(e) => {
							setImage(e.target.files[0])
							//const reader = new FileReader()
							//reader.onload = (e) => {
							//	setImage(e.target.result)
							//}
							//reader.readAsDataURL(e.target.files[0])
						}} />
					<button className="bg-blue-500 hover:bg-blue-700 
			text-white font-bold 
			mt-2 py-2 px-2 rounded"
						onClick={addPostF}>Add Post</button>
				</div>
			</div>
		</div>
	);
}

export default AddPost;
