const nodemailer = require('nodemailer')

const sendEmail = async (req, res)=>{
    let testAccount = await nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let info = await transporter.sendMail({
        from: '"AlloMedia" <allomedia@gmail.com',
        to: 'bar@example.com',
        subject: 'Hello',
        html: '<button>Verify</button>'
    })

    res.json(info)
}

module.exports = sendEmail