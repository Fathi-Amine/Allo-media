const jwt = require('jsonwebtoken')
const {StatusCodes} = require("http-status-codes");
const genToken = ({payload})=>{
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXP})
}
const verifyToken = ({token})=> jwt.verify(token, process.env.JWT_SECRET)

const attachCookieToResponse = ({res, user})=>{
    const token = genToken({payload: user})

    const oneDay = 1000*60*60*24
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
}

module.exports = {
    genToken,
    verifyToken,
    attachCookieToResponse
}
