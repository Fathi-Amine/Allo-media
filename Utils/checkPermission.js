const {UnauthenticatedErrorClass}=require('../Exceptions/index')

const checkPermission = (reqUser, resourceId)=>{
    // console.log(reqUser)
    // console.log(userId)
    // console.log(typeof userId)
    if (reqUser.userId === resourceId.toString()) return
    throw new UnauthenticatedErrorClass("Unauthorized Action")
}
module.exports = checkPermission