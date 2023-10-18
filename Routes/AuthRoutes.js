const express = require('express')
const router = express.Router()
const {login, register, dashboard, logout} = require('../Controllers/AuthController')
const authMiddleware = require('../Middlewares/authMiddleware')
const sendEmail = require('../Controllers/Email')

router.get('/dashboard', authMiddleware, dashboard)
router.get('/logout', logout )
router.post('/register',register)
router.post('/login', login)
router.get('/send', sendEmail)

module.exports = router
