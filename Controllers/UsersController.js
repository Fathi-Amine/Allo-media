const User = require('../Models/Users')
const {BadRequestErrorClass,UnauthenticatedErrorClass} = require('../Exceptions')
const {StatusCodes} = require('http-status-codes')


const getAllUsers = async(req, res)=>{
    console.log(req.user)
    const users = await User.find().select('-password')
    res.status(StatusCodes.OK).json({users})
}
const getSingleUser = async(req, res)=>{
    const user = await User.findOne({_id:req.params.id}).select('-password')
    if(!user){
        throw new BadRequestErrorClass("No User Found")
    }
    res.status(StatusCodes.OK).json({user})
}
const showCurrentUser = async(req, res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
}
const updateUser = async(req, res)=>{
    res.send("update user")
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