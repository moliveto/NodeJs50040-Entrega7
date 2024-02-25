const dotenv = require('dotenv');
dotenv.config();

const mongoURI = process.env.MONGO_URI;

module.exports = { mongoURI };
