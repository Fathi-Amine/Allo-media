const createTokenUser = (user)=>{
    return {name: user.username, userId: user._id, email:user.email}
}

module.exports = createTokenUser