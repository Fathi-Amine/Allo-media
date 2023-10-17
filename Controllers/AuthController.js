const jwt = require('jsonwebtoken')
const {BadRequestErrorClass,UnauthenticatedErrorClass} = require('../Exceptions')
const User = require('../Models/Users')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')

const register = async (req, res)=>{
    const user = await User.create({...req.body})
    const token = user.genToken()
    res.status(StatusCodes.CREATED).json({user:{name: user.username},token})
}
const login = async (req, res,next)=>{
    const {email, password} = req.body
    if (!email|| !password){
        const error = new BadRequestErrorClass("Please Provide an email and password");
        return res.status(error.status).json({message: error.message})
    }
    const user = await User.findOne({email})
    if(!user){
        const error = new UnauthenticatedErrorClass("Invalid Credentials");
        return res.status(error.status).json({message: error.message})
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        const error = new UnauthenticatedErrorClass("Invalid Credentials");
        return res.status(error.status).json({message: error.message})
    }
    const token = user.genToken()
    res.status(StatusCodes.OK).json({user:{name:user.username},token})
}

// const dashboard = async (req, res)=>{
//     console.log(req.user)
//     const luckNumber = Math.floor(Math.random()*100)
//     res.status(200).json({msg:`Hello ${req.user.username}`, secret: `Your lucky number is ${luckNumber}`})
// }

module.exports = {
    login,
    register
}