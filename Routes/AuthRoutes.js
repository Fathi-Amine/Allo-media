const express = require('express')
const router = express.Router()
const {login, register, dashboard, logout,forgotPassword,resetPassword} = require('../Controllers/AuthController')
const authMiddleware = require('../Middlewares/authMiddleware')
const sendEmail = require('../Controllers/Email')

router.get('/dashboard', authMiddleware, dashboard)
router.delete('/logout',authMiddleware, logout )
router.post('/register',register)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', resetPassword)


module.exports = router
