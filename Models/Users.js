const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: [true, 'Please Provide a name'],
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'Please Provide a name'],
        validate:{
            validator:validator.isEmail,
            message:"Please provide a valid email"
        }
        // match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid Email"],
        // unique: true
    },
    password : {
        type: String,
        required: [true, 'Please Provide a password'],
        minLength: 8,
    },
    verificationToken:String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verified:Date,
})


UserSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.comparePassword = async function(reqPassword){
    return await bcrypt.compare(reqPassword, this.password)
}
module.exports = mongoose.model('User', UserSchema)