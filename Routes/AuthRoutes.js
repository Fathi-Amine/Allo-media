const express = require('express')
const router = express.Router()
const {login, register} = require('../Controllers/AuthController')
const authMiddleware = require('../Middlewares/authMiddleware')

router.route('/register').post(register)
router.route('/login').post(login)

module.exports = router
