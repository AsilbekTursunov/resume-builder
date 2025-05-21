const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  image: { type: String, default: null }
}, {
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})

const User = mongoose.model('User', UserSchema)

module.exports = User
