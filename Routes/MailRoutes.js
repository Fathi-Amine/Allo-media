const express = require('express')
const router = express.Router()
const authMiddleware = require('../Middlewares/authMiddleware')
const {sendEmail,verifyEmail} = require('../Controllers/Email')

// const nodemailer = require('nodemailer')
router.post('/verify-email', verifyEmail)


module.exports = router