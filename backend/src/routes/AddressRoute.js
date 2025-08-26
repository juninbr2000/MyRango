const express = require('express')
const { createAddress, getAddress, editAddress, deleteAddress } = require('../controllers/AddressController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/create', authMiddleware, createAddress)
router.get('/', authMiddleware, getAddress)
router.put('/:id', authMiddleware, editAddress)
router.delete('/:id', authMiddleware, deleteAddress)

module.exports = router