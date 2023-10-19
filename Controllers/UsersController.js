const User = require('../Models/Users')
const {BadRequestErrorClass,UnauthenticatedErrorClass} = require('../Exceptions')
const {StatusCodes} = require('http-status-codes')
const {createTokenUser,attachCookieToResponse,checkPermissions} = require('../Utils/index')



const getAllUsers = async(req, res)=>{
    console.log(process.env.USERNAME)
    console.log(req.user)
    const users = await User.find().select('-password')
    res.status(StatusCodes.OK).json({users})
}
const getSingleUser = async(req, res)=>{
    const user = await User.findOne({_id:req.params.id}).select('-password')
    if(!user){
        throw new BadRequestErrorClass("No User Found")
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}
const showCurrentUser = async(req, res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
}
const updateUser = async(req, res)=>{
    const {email, name} = req.body;
    if (!email|| !name){
        throw new BadRequestErrorClass("Please Provide an email and password")
    }
    const user = await User.findOneAndUpdate({_id: req.user.userId},{email,username:name},{new:true,runValidators:true})
    const tokenUser = createTokenUser(user)
    attachCookieToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}
const updateUserPassword = async(req, res)=>{
    console.log(req.body)
    const {oldPassword, newPassword} = req.body
    if (!oldPassword|| !newPassword){
        throw new BadRequestErrorClass("Please Provide both values")
    }
    const user = await User.findOne({_id:req.user.userId})
    const isPasswordValid = await user.comparePassword(oldPassword)
    if(!isPasswordValid){
        throw new UnauthenticatedErrorClass("Invalid Credentials")
    }

    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({msg:"Password updated"})
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}