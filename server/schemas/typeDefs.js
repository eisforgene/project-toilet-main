const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        firstName: String!
        lastName: String!
        email: String!
        username: String!
        password: String!
        reviews: [Review]
    }
    type Review {
        _id: ID
        username: String
        overallRating: String
        coordinates: String
        genderNeutral: String
        cleanliness: String
        changingTable: String
        handicapAccessible: String
        toiletPaper: String
        keys: String
        comment: String
    }
    type Toilet {
        _id: ID
        coordinates: String!
        address: String!
        lng: String!
        lat: String!
        zipcode: String!
        reviews: [Review]
    }
    type Auth {
        token: ID
        user: User
    }
    type Query {
        me: User
        users: [User]
        user(username: String!): User
        toilets: [Toilet]
        toiletsByZip(zipcode: String!): [Toilet]
        toiletByAddress(address: String!): Toilet
        reviews: [Review]
        reviewsByUser(userId: ID!): User
        reviewsByToilet(coordinates: String!): Toilet
    }
    type Mutation {
        addUser(firstName: String!, lastName: String!, email: String!, username: String!, password: String!): Auth
        updateUser(firstName: String, lastName: String, email: String, username: String): User
        updatePassword(password: String!): User
        createNewToilet(coordinates: String!, address: String!, zipcode: String!, lng: String!, lat: String, overallRating: String!, genderNeutral: String!, cleanliness: String!, changingTable: String!, handicapAccessible: String!, toiletPaper: String!, keys: String!, comment: String!): Toilet
        addReview(overallRating: String!, coordinates: String!, genderNeutral: String!, cleanliness: String!, changingTable: String!, handicapAccessible: String!, toiletPaper: String!, keys: String!, comment: String!): Review
        updateReview(overallRating: String, coordinates: String, genderNeutral: String, cleanliness: String, changingTable: String, handicapAccessible: String, toiletPaper: String, keys: String, comment: String): Review
        login(email: String!, password: String!): Auth
    }
`;

module.exports = typeDefs;