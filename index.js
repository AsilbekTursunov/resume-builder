const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const connectDatabase = require('./config/db');
const path = require('path')
const app = express();
dotenv.config();


const userRoutes = require('./routes/userRoute')
const resumeRoutes = require('./routes/resumeRoute')
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // allow cookies
}))
app.use(express.json())
app.use(cookieParser())

// connect database
connectDatabase()


app.use('/api/auth', userRoutes)
app.use('/api/resume', resumeRoutes)

// Serve uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    },
  })
);


// app.use('/api/resume', resumeRoutes)
const PORT = process.env.PORT || 5000
app.listen(process.env.PORT, () => console.log(`Connected to ${PORT}`));

// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" to code to use JWT_SECRET