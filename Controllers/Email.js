const {BadRequestErrorClass,UnauthenticatedErrorClass} = require('../Exceptions')
const {StatusCodes} = require('http-status-codes')
const {verifyToken} = require("../Utils/index");
const User = require("../Models/Users")
const jwt = require('jsonwebtoken')

const verifyEmail = async(req,res)=>{
    const verificationToken = req.query.token
    const {email} = jwt.verify(verificationToken,process.env.JWT_SECRET)
    const user = await User.findOne({email})
    console.log(user._id)
    if(!user){
        throw new UnauthenticatedErrorClass("Verification failed")
    }
    const updatedUser = await User.findOneAndUpdate({_id: user._id},{isVerified:true,verified:Date.now(),verificationToken:""},{new:true,runValidators:true})
    res.status(StatusCodes.OK).json({updatedUser})
}

module.exports = {
    verifyEmail
}