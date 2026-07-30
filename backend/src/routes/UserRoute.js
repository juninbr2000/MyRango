const express = require('express')
const {register, login} = require('../controllers/UserController')
const { loginLimiter, registerLimiter } = require('../middlewares/rate-limit')

const router = express.Router()

router.post('/register', registerLimiter, register)
router.post('/login',loginLimiter, login)

module.exports = router