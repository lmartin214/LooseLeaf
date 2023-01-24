//config using Mongoose 
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/looseleaf',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

module.exports = mongoose.connection;