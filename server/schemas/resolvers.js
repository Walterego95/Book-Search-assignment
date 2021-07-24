const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const userData = await User.findOne({ email: context.user.email })
        .select('-__v -password');
      return userData;
    }
  },
  Mutation: {
  //   # Login requires email and password to return authentications related to JWT...
    login: async (_,{email, password}) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
  // add new user with email, password, username, to return JWT...
    addUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return {user, token};
    },
  // save book for user...
    saveBook: async (_, args, context) => {
      console.log(args);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet:  {savedBooks:args}  },
          { new: true }
        )

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  // remove book from user...
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: { bookId: bookId }
            }
          },
          { new: true }
        ).populate('books');

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;