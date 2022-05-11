const { AuthenticationError } = require('apollo-server-express');
const { User, Review, Toilet } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
      users: async() => {
        const user = await User.find()
                .select('-__v -password')
                .populate('reviews')
        
        return user;
      },
      user: async(parent, { username }) => {
          const user = await User.findOne({ username: username })
                    .select('-__v -password')
                    .populate('reviews')
            
        return user;
      },
      me: async(parents, args, context) => {
          if (context.user) {
              const me = await User.findOne({_id: context.user._id})
                    .select('-__v -password')
                    .populate('reviews')
            
            return me;
          }

          throw new AuthenticationError('Not logged in');
      },
      reviews: async() => {
        const reviews = await Review.find()
        
        return reviews;
    },
    toilets: async(parent, args) => {
        const toilets = await Toilet.find({})
                                    .populate('reviews')

        return toilets;
    },
    toiletsByZip: async (parent, args) => {
        const toilets = await Toilet.find({zipcode: args.zipcode})
                                    .populate('reviews')
        return toilets;
    },
    toiletByAddress: async (parent, args) => {
        const toilet = await Toilet.findOne({address: args.address})
                                    .populate('reviews')
        return toilet
    }
  },
  Mutation: {
    addUser:  async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);

        return{ token, user }
    },
    updateUser: async ( parent, args, context ) => {
        
        if (context.user) {
            const newMe = await User.findOneAndUpdate(
            { _id: context.user._id },
            { ...args },
            { new: true }
        )
        
        return newMe;
        }

        throw new AuthenticationError('You need to be logged in')
    },
    updatePassword: async (parent, args, context) => {
        if (context.user) {
            const newPassword = await User.findOne(
                {_id: context.user._id},
            )
            newPassword.password = args.password
            await newPassword.save()

            return await User.findOne({_id: context.user._id})
        }
        
        throw new AuthenticationError('You need to be logged in')
    },
    login: async ( parent, { email, password } ) => {
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
    addReview: async (parent, args, context) => {

        if (context.user) {
            
            const review = await Review.create({username: context.user.username, ...args})

            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                { $addToSet: {reviews: review._id}},
                {new: true}
                )            
           
            const updatedToilet = await Toilet.findOneAndUpdate(
                   {coordinates: args.coordinates},
                   { $push: {reviews: review._id}},
                   {new: true}
                   )

            return updatedToilet
        }

       throw new AuthenticationError('You need to be logged in!')
    },
    updateReview: async (parent, args, context) => {
        if (context.user) {
            
            const updatedReview = Review.findOneAndUpdate(
                { coordinates: args.coordinates},
                {...args},
                {new: true}
                )

            return updatedReview;
        }
        throw new AuthenticationError('You need to be logged in')
    },
    createNewToilet: async (parent, args, context) => {

        const {zipcode, address, coordinates, lng, lat, overallRating, genderNeutral, cleanliness, changingTable, handicapAccessible, toiletPaper, keys, comment} = args

        if (context.user) {
            const review = await Review.create({username: context.user.username, coordinates, overallRating, genderNeutral, cleanliness, changingTable, handicapAccessible, toiletPaper, keys, comment})

            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                { $addToSet: {reviews: review._id}},
                {new: true}
                )        

            const newToilet = await Toilet.create(
                { coordinates: coordinates, address: address, lng: lng, lat: lat, zipcode: zipcode, reviews: [review._id]}
            )

            return newToilet
        }
        throw new AuthenticationError('You need to be logged in')
    }
  }
};

module.exports = resolvers;