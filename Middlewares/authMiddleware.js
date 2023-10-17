const User = require('../Models/Users')
const jwt = require('jsonwebtoken')
const {UnauthenticatedErrorClass} = require('../Exceptions/index')

const authenticationMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        const error = new UnauthenticatedErrorClass("No token provided")
        return res.status(error.status).json({message: error.message})

    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const {userId, name} = payload
        req.user = {userId, name}
        next()
    }catch (e) {
        const error = new UnauthenticatedErrorClass("Not authorized to access")
        return res.status(error.status).json({message: error.message})
    }

}

module.exports = authenticationMiddleware