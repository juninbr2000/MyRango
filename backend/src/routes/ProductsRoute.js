const express = require('express')
const {createProduct, getProducts, updateProduct, deleteProduct, getOneProduct} = require('../controllers/ProductController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getOneProduct)
router.post('/create', authMiddleware, createProduct)
router.put('/:id', authMiddleware, updateProduct)
router.delete('/:id', authMiddleware, deleteProduct)

module.exports = router