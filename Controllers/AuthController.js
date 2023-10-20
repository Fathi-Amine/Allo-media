const jwt = require('jsonwebtoken')
const {BadRequestErrorClass,UnauthenticatedErrorClass} = require('../Exceptions')
const User = require('../Models/Users')
const Token = require('../Models/TokenModel')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const {attachCookieToResponse,createTokenUser,sendVerificationEmail,sendResetPasswordEmail} = require('../Utils/index')
const crypto = require('crypto')



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
    const tokenUser = createTokenUser(user)
    let refreshToken = ""
    const existingToken = await Token.findOne({user:user._id})
    if (existingToken){
        const {isValid} = existingToken
        if (!isValid){
            throw new UnauthenticatedErrorClass("Invalid Credentials")
        }
        refreshToken = existingToken.refreshToken
        attachCookieToResponse({res,user:tokenUser,refreshToken})
        res.status(StatusCodes.OK).json({user:tokenUser})
        return;
    }
    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = {refreshToken,ip,userAgent,user:user._id}
    await Token.create(userToken)
    attachCookieToResponse({res,user:tokenUser,refreshToken})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

const dashboard = async (req, res)=>{
    console.log(req.user)
    const luckNumber = Math.floor(Math.random()*100)
    res.status(200).json({msg:`Hello ${req.user.name}`, secret: `Your lucky number is ${luckNumber}`})
}

const logout = async (req,res)=>{

    await Token.findOneAndDelete({user:req.user.userId})
    res.cookie('accessToken','logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.cookie('refreshToken','logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg:"Logged Out"})
}

const forgotPassword = async (req,res)=>{
    const {email} = req.body
    if (!email){
        throw new BadRequestErrorClass("Please Provide Valid Email")
    }

    const user = await User.findOne({email})
    if(user){
        const passwordToken = crypto.randomBytes(70).toString('hex')
        const origin = req.get('origin')
        await sendResetPasswordEmail({name:user.username,email:user.email, token:passwordToken,origin})

        const expirationInterval = 1000*60*10
        const passwordTokenExpirationDate = new Date(Date.now() + expirationInterval)
        await User.findOneAndUpdate({_id: user._id},{passwordToken,passwordTokenExpirationDate},{new:true})
    }
    res.status(StatusCodes.OK).json({message:"Check Your email"})
}

const resetPassword = async (req,res)=>{
    const {token, email, password} = req.body
    if (!email || !password || !token){
        throw new BadRequestErrorClass("Please Provide valid values")
    }

    const user = await User.findOne({email})

    if (user){
        const currentDate = new Date()
        if(user.passwordToken === token && user.passwordTokenExpirationDate > currentDate ){
            user.password = password
            user.passwordToken = null
            user.passwordTokenExpirationDate = null
            user.save()
            res.status(StatusCodes.OK).json("Updated")
        }
    }
}
module.exports = {
    dashboard,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
}