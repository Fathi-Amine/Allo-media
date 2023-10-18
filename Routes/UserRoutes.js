const { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword} = require('../Controllers/UsersController')
const express = require('express')
const router = express.Router()
const authMiddleware = require('../Middlewares/authMiddleware')
const sendEmail = require('../Controllers/Email')

router.get('/',authMiddleware, getAllUsers)
router.get('/showMe',authMiddleware, showCurrentUser)
router.patch('/updateUser',authMiddleware, updateUser)
router.patch('/updatePassword',authMiddleware, updateUserPassword)
router.get('/:id',authMiddleware, getSingleUser)

module.exports = router