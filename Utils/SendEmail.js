const nodemailer = require("nodemailer");
const nodemailerConfig = require('../Config/NodemailerConfig')


const sendEmail = async ({to,subject,html})=>{
    let testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport(nodemailerConfig);

    let info = await transporter.sendMail({
        from: '"AlloMedia" <allomedia@gmail.com',
        to,
        subject,
        html
    })
}

module.exports=sendEmail