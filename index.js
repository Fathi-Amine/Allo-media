require('dotenv').config();
require('express-async-errors');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT
const authRoutes = require('./Routes/AuthRoutes')
const {urlencoded} = require("express");
const errorHandlerMiddleware = require('./Middlewares/errorHandler');
const connectToDatabase = require('./Database/connect')



app.use(express.json());
app.use(errorHandlerMiddleware);

app.use('/api/', authRoutes)

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