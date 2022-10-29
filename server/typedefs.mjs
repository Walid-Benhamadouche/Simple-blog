import { gql } from 'apollo-server-express'

const typeDefs = gql`

    scalar Upload

    type User {
        _id: ID!
        name: String!
        email: String!
        posts: [Post!]!
    }

    type Post {
        _id: ID!
        userID: ID!
        user: User!
        title: String!
        content: String!
        img: String
    }

    type Query {
        user: User
        logIn(email: String!, password: String!): String!
    }

    type Mutation {
        signUp(email: String!, password: String!, name: String!): String!
        createPost(title: String!, content: String!, img: Upload): Post!
        updatePost(_id: ID!, title: String, content: String, img: String): Post!
        deletePost(_id: ID!): Boolean!
    }
`

export default typeDefs