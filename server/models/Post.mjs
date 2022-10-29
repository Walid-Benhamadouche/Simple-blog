import mongoose from 'mongoose'

const PostSchema = mongoose.Schema({
    userID: String,
    title: String,
    content: String,
    img: String
});

export default mongoose.model('Post', PostSchema)