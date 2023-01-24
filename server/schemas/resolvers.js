const { AuthenticationError } = require("apollo-server-express");
const { User, Product, Category, Order } = require("../models");
const { signToken } = require("../utils/auth");
const stripe = require("stripe")( process.env.STRIPE_PUBLIC_KEY );

const resolvers = { 
  Query: {
    categories: async () => {//Retrieves all categories from the database 
      return await Category.find();
    }, 
    //Retrieves all products from the database, optionally filtered by category and/or name 
    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        params.name = {
          $regex: name,
        };
      }

      return await Product.find(params).populate("category");
    },
    product: async (parent, { _id }) => { // Retrieves a single product from the database by its ID 
      return await Product.findById(_id).populate("category");
    },
    user: async (parent, args, context) => { // Retrieves the current user from the database
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: "orders.products",
          populate: "category",
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError("Not logged in");
    },
    userFree: async (parent, args, ) => {//Retrieves all users from the database
      try {
        const user = await User.find().populate({
            path: "orders.products",
            populate: "category",
          });
          // user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
  
          return user;
        
      } catch (error) {
        console.log(error)
      }  

    },
    orders: async (parent, args) => {// Retrieves all orders from the database 
      const orders = await Order.find();
      return orders;
    },
    order: async (parent, { _id }, context) => {// Retrieves a single order from the database by its ID 
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: "orders.products",
          populate: "category",
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError("Not logged in");
    },
    checkout: async (parent, args, context) => {//Creates a Stripe checkout session
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ products: args.products });
      const line_items = [];

      const { products } = await order.populate("products");

      for (let i = 0; i < products.length; i++) {
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/images/${products[i].image}`],
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: products[i].price * 100,
          currency: "usd",
        });

        line_items.push({
          price: price.id,
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });

      return { session: session.id };
    },
  },
  Mutation: {
    addUser: async (parent, args) => {//Adds a new user to the database and returns a JSON web token 
      const user = await User.create(args);

      const token = signToken(user);
    console.log(token)

      return { token, user };
    },
    addOrder: async (parent, { products }, context) => {// Adds a new order to the current user in the database
      console.log(context);
      console.log(products);
      console.log(...products);
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, {
          $push: { orders: order },
        });

        return order;
      }

      throw new AuthenticationError("Not logged in");
    },
    addOrderUnprotected: async (parent, args) => { //Adds a new order to a user in the database (from testing mutation)
      try {
        // console.log(products);
        // console.log(...products);
        const order = new Order({products: args.products}).populate("products")
        order.products = args.products
        await User.findByIdAndUpdate("63c8ba5a862fbf443e827a13", {
          $push: { orders: order },
        });

        return order;
      } catch (error) {
        console.log(error);
      }
    },
    updateUser: async (parent, args, context) => {//Updates the current user in the database
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }

      throw new AuthenticationError("Not logged in");
    },
    updateProduct: async (parent, { _id, quantity }) => {//Updates the quantity of a product in the database
      const decrement = Math.abs(quantity) * -1;

      return await Product.findByIdAndUpdate(
        _id,
        { $inc: { quantity: decrement } },
        { new: true }
      );
    },
    login: async (parent, { email, password }) => {//Logs a user in and returns a JSON web token
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
  },
};

module.exports = resolvers;
