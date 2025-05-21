const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
// @desc   - Register new user
// @route  - POST /api/auth/register
// @access - Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, image } = req.body

    const existUser = await User.findOne({ email })
    if (existUser) return res.status(200).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      image
    })
    res.status(200).json({
      status: 'Success', user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        createdAt: newUser.createdAt
      },
      token: generateToken(newUser._id, newUser.email)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}


// @desc   - Login into exist user
// @route  - POST /api/auth/login
// @access - Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const existUser = await User.findOne({ email })
    if (!existUser) return res.status(200).json({ message: 'Email is wrong or not registered yet' })

    const rightPassword = bcrypt.compareSync(password, existUser.password)
    if (!rightPassword) return res.status(200).json({ message: 'Incorrect password' })

    res.status(200).json({
      status: 'Success', user: {
        id: existUser._id,
        name: existUser.name,
        email: existUser.email,
        image: existUser.image,
        createdAt: existUser.createdAt
      },
      token: generateToken(existUser._id, existUser.email)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}


// @desc   - Get user details
// @route  - POST /api/auth/profile
// @access - Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt
    })
  } catch (error) {

  }
}


module.exports = { registerUser, loginUser, getUserProfile }