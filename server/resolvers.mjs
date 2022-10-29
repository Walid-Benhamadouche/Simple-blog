import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import {finished} from 'stream/promises'
import * as fs from 'fs';

import * as dotenv from 'dotenv';

import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({path:  __dirname+"../../.env"})

import User from './models/User.mjs'
import Post from './models/Post.mjs'

const resolvers = {

  Upload: GraphQLUpload,

  ///////////////////////// TypeDef specific queries /////////////////////////
  User: {
    posts: async(parent, args, context) =>
    {
      try{
        const posts = await Post.find({userID: context.id})
        return posts
      }catch(err){
        
      }
    }
  },
  Post: {
    user: async(parent, args, context) =>
    {
      try {
        const user = await User.findOne({_id: context.id})
        return user 
      }catch(err) {
        
      }
    }
  },

  ///////////////////////// Query lists /////////////////////////
  Query: {
    user: async (parent, args, context) => 
    {
      try{
        const user = await User.findOne({ _id: context.id})
        console.log(user)
        return {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }catch(err){
        console.log(err)
      }
    },
    logIn: async (parent, args) =>
    {
      try {
        const user = await User.findOne({ email: args.email})

        console.log(args.password)

        let valid = await bcrypt.compare(args.password, user.password)

        console.log(valid)

        if(!valid)
        {
          console.log("wrong password")
        }
        else{
          return jwt.sign({id: user._id}, process.env.JWT_SECRET)
        }

      }catch(err){
        console.log(err)
      }
    }
  },

  ///////////////////////// Mutation lists /////////////////////////
  Mutation: {
    signUp: async (parent, args) =>
    {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(args.password, salt)
        const user = new User({
          name: args.name,
          email: args.email,
          password: hashedPassword
        })
        const cu = await user.save()
        return jwt.sign({id: cu._id}, process.env.JWT_SECRET)

      }catch(err){
        console.log(err)
      }
    },
    createPost: async (parent, args, context) =>
    {
      const { createReadStream, filename, mimetype, encoding } = await args.img;
      const stream = createReadStream();

      const out = fs.createWriteStream('name here.png',);
      stream.pipe(out);
      await finished(out);

      try {
        const post = new Post({
          userID: context.id,
          title: args.title,
          content: args.content,
          //img: args.img
        })
        const cp = await post.save()
        return cp
      }catch(err){
        console.log(err)
      }
    },
    updatePost: async (parent, args) =>
    {
      try {
        const post = {
          title: args.title,
          content: args.content,
          img: args.img
        }
        const cp = await Post.findOneAndUpdate({_id: args._id}, post)
        console.log(cp)
        return cp
      }catch(err){
        console.log(err)
      }
    },
    deletePost: async (parent, args) =>
    {
      try {
        console.log(args)
        await Post.findOneAndDelete({_id: args._id})
        return true
      }catch(err){
        return false
      }
    }
  }
}

export default resolvers