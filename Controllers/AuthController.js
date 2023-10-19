const jwt = require('jsonwebtoken')
const {BadRequestErrorClass,UnauthenticatedErrorClass} = require('../Exceptions')
const User = require('../Models/Users')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const {attachCookieToResponse,createTokenUser,sendVerificationEmail,genToken} = require('../Utils/index')


const register = async (req, res)=>{
    const origin = req.get('origin')
    const {username,email} = req.body

    const userToken = {name: username, email:email}
    const verificationToken = jwt.sign({name: username, email:email}, process.env.JWT_SECRET, {expiresIn: '10m'})
    const user = await User.create({...req.body,verificationToken})
    // /*const userToken = createTokenUser(user)
    // attachCookieToResponse({res,user:userToken})*/
    await sendVerificationEmail({username,email,verificationToken,origin})
    res.status(StatusCodes.CREATED).json({msg: 'Success! Please check your email for verification'})
}
const login = async (req, res,next)=>{
    const {email, password} = req.body
    if (!email|| !password){
        throw new BadRequestErrorClass("Please Provide an email and password")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedErrorClass("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new UnauthenticatedErrorClass("Invalid Credentials")
    }
    const isVerified = user.isVerified
    if(!isVerified){
        throw new UnauthenticatedErrorClass("Please verify your email first")
    }
    const userToken = createTokenUser(user)
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