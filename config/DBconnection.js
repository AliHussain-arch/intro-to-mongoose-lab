const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connectToDB() {
  return mongoose.connect(process.env.DB)
}

module.exports = connectToDB;
