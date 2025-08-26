const express = require('express')
const {createOrder, getUserOrders, updateProductStatus, getAllOrders, productPayment } = require('../controllers/OrderController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, createOrder)
router.put('/:id', authMiddleware, updateProductStatus)
router.get('/', authMiddleware, getUserOrders)
router.get('/all', authMiddleware, getAllOrders)
router.put('/pay/:id', authMiddleware, productPayment)

module.exports = router