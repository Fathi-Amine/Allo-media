const jwt = require('jsonwebtoken')
const {StatusCodes} = require("http-status-codes");

const genToken = ({payload})=>{
    return jwt.sign(payload, process.env.JWT_SECRET)
}
const verifyToken = (token)=> jwt.verify(token, process.env.JWT_SECRET)

const attachCookieToResponse = ({res, user,refreshToken})=>{
    const accessTokenJWT = genToken({payload: {user}})
    const refreshTokenJWT = genToken({payload: {user, refreshToken}})

    const oneDay = 1000*60*60*24
    const oneMonth = 1000*60*60*24*30
    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge:oneDay,
    })
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        expires: new Date(Date.now() + oneMonth),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    })
}

// const attachCookieToResponse = ({res, user})=>{
//     const token = genToken({payload: user})
//
//     const oneDay = 1000*60*60*24
//     res.cookie('token', token, {
//         httpOnly: true,
//         expires: new Date(Date.now() + oneDay),
//         secure: process.env.NODE_ENV === 'production',
//         signed: true
//     })
// }

module.exports = {
    genToken,
    verifyToken,
    attachCookieToResponse
}
