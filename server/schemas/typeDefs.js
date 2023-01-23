const { gql } = require('apollo-server-express');

/*This code defines the type definitions for a GraphQL schema.
This schema is used to query and interact with a database, specifically for products, orders, auth and users.*/
const typeDefs = gql`
  type Category {
    _id: ID!
    name: String!
  }

  type Product {
    _id: ID!
    name: String!
    description: String
    image: String
    price: Float!
    quantity: Int
    category: Category
  }

  type Order {
    _id: ID!
    purchaseDate: String
    products: [Product]
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    orders: [Order]
  }

  type Checkout {
    session: ID
  }
  # Set up an Auth type to handle returning data from a profile creating or user login
  type Auth {
    token: ID
    user: User
  }

  type Query {
    categories: [Category]
    products(category: ID, name: String): [Product]
    product(_id: ID!): Product
    user: User
    userFree: [User]
    orders: [Order]
    order(_id: ID!): Order
    checkout(products: [ID]!): Checkout
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addOrder(products: [ID]!): Order
    addOrderUnprotected(products: [ID]!): Order
    updateUser(firstName: String, lastName: String, email: String, password: String!): User
    updateProduct(_id: ID!, quantity: Int!): Product
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;