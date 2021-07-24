const { gql } = require('apollo-server-express');
const typeDefs = gql`
# User
type User {
  _id: ID
  # User's name
  username: String
  # User's email address
  email: String
  # How many books 
  bookCount: Int
  # Array of User's saved books
  savedBooks: [Book]
}
# type of book
type Book {
  # Book's id from google api
  bookId: String
  # Book's authors, may be more than one
  authors: [String]
  # descriptionn of book's content
  description: String
  # Title of book
  title: String
  # picture of book
  image: String
  # Link to the book
  link: String
}
# User Authentication
type Auth {
  # JWT token
  token: ID!
  # reference a logged in User
  user: User
}
# query for a User
type Query {
  # returns a single User
  me: User
}
# All mutations
type Mutation {
  # Login requires email and password returns authentication/new JWT for User
  login(email: String!, password: String!): Auth
  # add a new User requires email, password, username, and returns JWT
  addUser(username: String!, email: String!, password: String!): Auth
  # saves a book to a specific User
  saveBook(bookId: String, authors: [String], description: String, title: String, image: String, link: String): User
  # remove a book from a User
  removeBook(bookId: String):User
}
# # book input used to pass parameters in saveBook
# input BookInput {
#   bookId: String
#   authors: [String]
#   description: String
#   title: String
#   image: String
#   link: String
# }
`;

module.exports = typeDefs;