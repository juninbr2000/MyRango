const Order = require('../models/Order')
const Address = require('../models/Address')
const Product = require('../models/Product')
const moongose = require('mongoose')
const { getIO } = require("../socket/socket");


const io = getIO

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user?.id

        if (!userId) return res.status(401).json({ error: 'Autenticação necessaria!' })

        const { addressId, products, paymentMethod } = req.body

        if (!addressId) return res.status(400).json({ error: 'Endereço não informado!' })
        if (!products) return res.status(400).json({ error: 'Minimo de produtos não alcançado!' })
        if (!paymentMethod) return res.status(400).json({ error: 'Metodo de pagamento não especificado!' })

        const delivereAddress = await Address.findOne({ _id: addressId, createdBy: userId })

        if (!delivereAddress) {
            return res.status(400).json({ error: 'Endereço não encontrado!' })
        }

        const productsId = products.map(p => p.product)
        const productList = await Product.find({ _id: { $in: productsId }, available: true })

        if (!productList || productList.length === 0) return res.status(404).json({ error: 'não foi possivel encontrar o produto' })

        const productsData = products.map(p => {
            const foundProduct = productList.find(prod => prod._id.toString() === p.product)
            return {
                product: foundProduct._id,
                name: foundProduct.title,
                quantity: p.quantity,
                priceAtTimeOfPurchase: foundProduct.price
            }
        })

        console.log(productsData)

        const totalPrice = productsData.reduce((sum, p) => sum + (p.priceAtTimeOfPurchase * p.quantity), 0)

        const order = new Order({
            user: userId,
            address: delivereAddress,
            products: productsData,
            paymentMethod,
            totalPrice,
            status: 'pending',
            paymentStatus: 'pending'
        })

        await order.save()

        res.status(201).json(order)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Não foi possivel realizar o pedido!' })
    }
}

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user?.id

        if (!userId) return res.status(401).json({ error: 'autenticação necessaria!' })

        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).select('_id totalPrice ProductStatus paymentMethod createdAt updatedAt')

        res.status(200).json(orders)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error || 'Não foi possivel buscar seus pedidos' })
    }
}


exports.getOneOrder = async (req, res) => {
    try{
        const userId = req.user?.id
        const {id} = req.params

        if(!userId) return res.status(401).json({ error: 'autenticação necessaria!' })

        if(!id || !moongose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido!'})

        const order = await Order.findOne({user: userId, _id: id})

        if(!order) return res.status(404).json({ error: 'Nenhum pedido encontrado'})

        res.status(200).json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error || 'Não foi possivel buscar seu pedido' })
    }
}


exports.updateProductStatus = async (req, res) => {
    try {
        const userId = req.user?.id

        if (!userId) return res.status(401).json({ error: 'Autenticação necessaria!' })

        const isAdmin = req.user?.role === 'admin'

        if (!isAdmin) return res.status(403).json({ error: 'Somente administradores podem fazer essa soliciatação' })

        const { id } = req.params

        if (!id) return res.status(400).json({ error: 'ID não informado' })

        const { ProductStatus } = req.body

        if (!ProductStatus) return res.status(400).json({ error: 'Campos obrigatorios não foram preenchidos!' })

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(ProductStatus)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        const updatedDocument = await Order.findOneAndUpdate({ _id: id }, { $set: { ProductStatus } }, { new: true })

        res.status(200).json(updatedDocument)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error || 'Erro ao atualizar o status do produto' })
    }
}

exports.getAllOrders = async (req, res) => {
    try{
        const userId = req.user?.id

        const isAdmin = req.user?.role === 'admin'

        if(!userId) return res.status(401).json({error: "Autenticação necessaria!"})
        if(!isAdmin) return res.status(403).json({error: "Somente administradores podem fazer essa soliciatação"})
    
        const orders = await Order.find({
            paymentStatus: 'paid', 
            ProductStatus: {$in: ['pending', 'processing', 'shipped', 'delivered']}})
            .sort({createdAt: -1})
            .populate('address').populate('user', '-password -cpf -role')

        res.status(200).json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Error ao buscar pedidos'})
    }
}

exports.productPayment = async (req, res) => {
    try {
        const userId = req.user?.id
        const { id } = req.params
        const { paymentStatus } = req.body

        if(!userId) return res.status(401).json({error: 'Autenticação necessaria!'})
        if(!id) return res.status(400).json({error: 'ID não informado!'})
        if (!paymentStatus) return res.status(400).json({ error: 'O status não foi preenchido!' })

        const validStatus = ['pending', 'paid', 'failed']
        if(!validStatus.includes(paymentStatus)) return res.status(400).json({error: 'O status de pagamento é invalido!'})

        const updatedDocument = await Order.findOneAndUpdate({ _id: id }, { $set: { paymentStatus } }, { new: true })

        io.to(`order-${id}`).emit("payment-status-updated", updatedDocument);

        res.status(200).json(updatedDocument)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error || 'Erro ao atualizar o status do produto' })
    }
}