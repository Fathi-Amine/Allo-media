const sendEmail = require('./SendEmail')

const sendVerificationEmail = async({name,email,verificationToken,origin})=>{
    const verifyEmail = `${origin}/mail/verify-email?token=${verificationToken}`
    const message = `<p>Please confirm your email by clicking the link <a href="${verifyEmail}">Verify</a> </p>`

    return sendEmail({to:email, subject: "Email Verification",html:message})
}

module.exports = sendVerificationEmail