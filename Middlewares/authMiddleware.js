const User = require('../Models/Users')
const {UnauthenticatedErrorClass} = require('../Exceptions/index')
const {verifyToken} = require('../Utils/index')
const Token = require('../Models/TokenModel')
const {attachCookieToResponse,} = require('../Utils/index')



const authenticationMiddleware = async (req, res, next)=>{
    const {refreshToken, accessToken} = req.signedCookies

    try{
        if (accessToken){
            console.log(accessToken)
            const payload = verifyToken(accessToken)
            req.user = payload.user
            return next()
        }
        if (!refreshToken){
                const error = new UnauthenticatedErrorClass("Not authorized to access")
                return res.status(error.status).json({message: error.message})
        }
        const payload = verifyToken(refreshToken)
        const existingToken = await Token.findOne({
            user:payload.user.userId,
            refreshToken: payload.refreshToken
        })
        if (!existingToken || !existingToken.isValid){
            throw new UnauthenticatedErrorClass("Authentication failed")
        }
        attachCookieToResponse({res, user: payload.user, refreshToken: existingToken.refreshToken} )
        req.user=payload.user
        next()
    }catch (e) {
        console.log(e)
    }

    // const authHeader = req.headers.authorization
    // if (!authHeader || !authHeader.startsWith("Bearer ")){
    //     const error = new UnauthenticatedErrorClass("No token provided")
    //     return res.status(error.status).json({message: error.message})
    // }
    // const token = authHeader.split(' ')[1]
    // try {
    //     const payload = jwt.verify(token, process.env.JWT_SECRET)
    //     const {userId, name} = payload
    //     req.user = {userId, name}
    //     next()
    // }catch (e) {
    //     const error = new UnauthenticatedErrorClass("Not authorized to access")
    //     return res.status(error.status).json({message: error.message})
    // }
}

module.exports = authenticationMiddleware