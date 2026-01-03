require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ,
  JWT_SECRET: process.env.JWT_SECRET  ,
  JWT_EXPIRE: process.env.JWT_EXPIRE ,
  NODE_ENV: process.env.NODE_ENV ,
};
