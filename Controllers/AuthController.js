const jwt = require('jsonwebtoken')
const {BadRequestErrorClass,UnauthenticatedErrorClass} = require('../Exceptions')
const User = require('../Models/Users')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const {attachCookieToResponse} = require('../Utils/index')

const register = async (req, res)=>{
    const user = await User.create({...req.body})
    const userToken = {name: user.username, userId: user._id}
    // const token = genToken({payload: userToken})
    attachCookieToResponse({res,user:userToken})
    res.status(StatusCodes.CREATED).json({user:{name: user.username}})
}
const login = async (req, res,next)=>{
    const {email, password} = req.body
    if (!email|| !password){
        // const error = new BadRequestErrorClass("Please Provide an email and password");
        // return res.status(error.status).json({message: error.message})
        throw new BadRequestErrorClass("Please Provide an email and password")
    }
    const user = await User.findOne({email})
    if(!user){
        // const error = new UnauthenticatedErrorClass();
        // return res.status(error.status).json({message: error.message})
        throw new UnauthenticatedErrorClass("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        // const error = new UnauthenticatedErrorClass("Invalid Credentials");
        // return res.status(error.status).json({message: error.message})
        throw new UnauthenticatedErrorClass("Invalid Credentials")
    }
    const userToken = {name: user.username, userId: user._id, email:user.email}
    // const token = genToken({payload: userToken})
    attachCookieToResponse({res,user:userToken})
    res.status(StatusCodes.OK).json({userToken})
}

const dashboard = async (req, res)=>{
    console.log(req.user)
    const luckNumber = Math.floor(Math.random()*100)
    res.status(200).json({msg:`Hello ${req.user.name}`, secret: `Your lucky number is ${luckNumber}`})
}

const logout = async (req,res)=>{
    res.cookie('token','logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 5*1000)
    })
    res.status(StatusCodes.OK).json({msg:"Logged Out"})
}
module.exports = {
    dashboard,
    login,
    register,
    logout
}