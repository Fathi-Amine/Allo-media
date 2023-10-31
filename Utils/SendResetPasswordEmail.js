
const sendEmail = require('./SendEmail')

const sendResetPasswordEmail = async({name,email,token,origin})=>{
    const resetURL = `${origin}/user/reset-password/${token}/${email.replace(/\./g, '_dot_')}`
    const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;
    return sendEmail({
        to:email,
        subject: "Email Verification",
        html: `<h4>Hello, ${name}</h4>
   ${message}
   `,})
}

module.exports = sendResetPasswordEmail