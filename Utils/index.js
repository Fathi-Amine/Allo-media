const {genToken, verifyToken, attachCookieToResponse} = require('./jwt')
const createTokenUser = require('./CreateTokenUser')
const checkPermissions = require('./checkPermission')
module.exports = {
    genToken,
    verifyToken,
    attachCookieToResponse,
    createTokenUser,
    checkPermissions
}