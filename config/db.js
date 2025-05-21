const mongoose = require('mongoose')

const connectDatabase = async () => {
  let isConnedted = false
  if (isConnedted) {
    console.log('Successfully connected');
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('Successfully connected');
    isConnedted = true
  } catch (error) {
    console.log('Error while connecting to databse');
  }
}

module.exports = connectDatabase