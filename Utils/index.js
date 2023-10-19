const {genToken, verifyToken, attachCookieToResponse} = require('./jwt')
const createTokenUser = require('./CreateTokenUser')
const checkPermissions = require('./checkPermission')
const sendVerificationEmail = require('./SendVerificationEmail')
const sendResetPasswordEmail = require('./SendResetPasswordEmail')
module.exports = {
    genToken,
    verifyToken,
    attachCookieToResponse,
    createTokenUser,
    checkPermissions,
    sendVerificationEmail,
    sendResetPasswordEmail
}