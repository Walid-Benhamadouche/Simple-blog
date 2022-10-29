import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import http from 'http'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import * as dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url'

import typeDefs from './typedefs.mjs'
import resolvers from './resolvers.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({path:  __dirname+"../../.env"})

mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true,useUnifiedTopology: true },()=>{console.log("connected to mongo")})

const app = express()

const httpServer = http.createServer(app)

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
        const token = req.headers.authorization
        let user = ''
        try {
            user = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            console.log(error)
        }
        return user
    },
    plugins: [ApolloServerPluginDrainHttpServer({httpServer}), ApolloServerPluginLandingPageGraphQLPlayground]
})

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}))

app.use(graphqlUploadExpress())

await apolloServer.start()

apolloServer.applyMiddleware({app})


await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))
console.log(`Server ready at http://localhost:4000${apolloServer.graphqlPath}`)