const Product = require('../models/Product')

exports.createProduct = async (req, res) => {
    try {
        const userId = req.user?.id

        if(!userId) {
            return res.status(401).json({ error: 'Autenticação necessaria' })
        }

        const isAdmin = req.user?.role === 'admin'

        if(!isAdmin){
            return res.status(403).json({ error: 'Somente administradores podem fazer essa soliciatação'})
        }
        
        const {title, description, available, price, imageUrl, amount} = req.body

        if(!title || !price || !available ){
            return res.status(400).json({error: 'Campos obrigatorios não foram preenchidos! '})
        }

        const product = new Product({title, description, available, price, imageUrl, amount, createdBy: userId})

        await product.save()

        res.status(201).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'não foi possivel criar o produto!'})
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const {id} = req.params

        const userId = req.user?.id

        const {title, description, available, price, imageUrl, amount} = req.body

        const isAdmin = req.user?.role

        if(!id){
            return res.status(400).json({ error: 'ID invalido!' })
        }

        if(!userId){
            return res.status(401).json({ error: 'Autenticação necessaria!' })
        }

        if(!title || !available || !price ){
            return res.status(400).json({ error: "Campos obrigatorios não foram preenchidos" })
        }

        if(!isAdmin) return res.status(403).json({error: "Somente administradores podem fazer essa soliciatação"})
        
        const productData = {
            title,
            description,
            available,
            price,
            imageUrl,
            amount
        }

        const updatedProduct = await Product.findOneAndUpdate({_id: id, createdBy: userId}, {$set: productData}, {new: true})

        if(!updatedProduct){
            return res.status(404).json({ error: 'Produto não encontrado!' })
        }

        res.status(200).json(updatedProduct)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Não foi possivel atualizar o Produto'})
    }
}

exports.getProducts = async (req, res) => {
    try {
        const product = await Product.find({available: true})

        if(product.length === 0){
            return res.status(200).json([])
        }

        return res.status(200).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Não foi possivel buscar os produtos'})
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const userId = req.user?.id

        const {id} = req.params
        
        const isAdmin = req.user?.role
        
        if(!userId) return res.status(401).json({error: 'Autenticação necessaria!'})

        if(!isAdmin) return res.status(403).json({error: 'Somente administradores podem fazer essa soliciatação'})

        if(!id) return res.status(400).json({ error: 'ID invalido!' })

        const product = await Product.findOneAndDelete({_id: id, createdBy: userId})

        if(!product) return res.status(404).json({error: 'Nenhum produto foi encontrado'})

        res.status(200).json({message: 'Produto apagado com sucesso'})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Error ao apagar o Produto'})
    }
} 

exports.getOneProduct = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) return res.status(400).json({error: 'Id invalido'})

        const product = await Product.findById(id)

        res.status(200).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Error ao buscar o Produto'})
    }
}