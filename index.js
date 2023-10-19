require('dotenv').config();
require('express-async-errors');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT
const authRoutes = require('./Routes/AuthRoutes')
const userRoutes = require('./Routes/UserRoutes')
const mailRoutes = require('./Routes/MailRoutes')
const {urlencoded} = require("express");
const cookieParser = require('cookie-parser')
const connectToDatabase = require('./Database/connect')
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const errorHandlerMiddleware = require('./Middlewares/errorHandler');

app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(helmet());
app.use(cors());
app.use('/api/', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/mail', mailRoutes)

app.use(errorHandlerMiddleware);

const start = async ()=> {
    try {
        await connectToDatabase(process.env.MONGODB_URI)

        app.listen(PORT, () => {
            console.log("Listening to ....")

        })
    }catch (e){
        console.log(e)
    }
}

start()