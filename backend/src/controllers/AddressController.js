const Address = require('../models/Address')

exports.createAddress = async (req, res) => {
    try {
        const {cidade, cep, rua, complemento, referencia, bairro} = req.body

        if(!cidade || !cep || !rua || !bairro ){
            return res.status(400).json({error: 'Campos obrigatórios não preenchidos!'})
        }

        const userId = req.user?.id

        if(!userId){
            return res.status(401).json({error: 'Autenticação necessaria!'})
        }

        const address = new Address({cidade, cep, rua, complemento, bairro, referencia, createdBy: userId})

        await address.save()

        return res.status(201).json({cidade: address.cidade, rua: address.rua, complemento: address.complemento, bairro: address.bairro, cep: address.cep, referencia: address.referencia, createdBy: address.createdBy })

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'não foi possivel adicionar o endereço' })
    }
}

exports.getAddress = async (req, res) => {
    try {
        const userId = req.user?.id

        if(!userId) {
            return res.status(401).json({error: 'Autenticação necessaria!'})
        }

        const address = await Address.find({createdBy: userId})

        if(address.length === 0){
            return res.status(200).json({})
        }

        res.status(200).json(address)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Não foi possivel buscar endereços'})
    }
}

exports.getOneAddress = async (req, res) => {
    try {
        const userId = req.user?.id
        const { id } = req.params

        if(!userId) return res.status(401).json( {error: 'Autenticação necessaria!'} )
        
        if(!id) return res.status(400).json( {error: 'ID inválido!'} )
        
        const address = await Address.findOne({createdBy: userId, _id: id})

        if(!address) return res.status(404).json({error: 'Endereço não encontrado!'})
        
        res.status(200).json(address)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Não foi possivel atualizar o endereço'})
    }
}

exports.editAddress = async (req, res) => {
    try {
        const {cidade, cep, rua, complemento, referencia, bairro} = req.body
        const { id } = req.params

        const userId = req.user?.id

        if(!userId){
            return res.status(401).json({error: 'Autenticação necessaria!'})
        }

        if(!id){
            return res.status(400).json({error: 'ID inválido'})
        }

        if(!cidade || !cep || !rua || !bairro){
            return res.status(400).json({error: 'Campos obrigatórios não preenchidos!'})
        }

        const address = await Address.findOne({_id: id, createdBy: userId})

        if(!address) {
            return res.status(404).json({error: 'Endereço não encontrado!'})
        }

        const addressData = {
            cidade,
            cep,
            rua,
            bairro,
            complemento,
            referencia
        }

        const updateAddress = await Address.findOneAndUpdate({_id: id, createdBy: userId}, {$set: addressData}, {new: true})

        res.status(200).json(updateAddress)

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Não foi possivel atualizar o endereço'})
    }
}


exports.deleteAddress = async (req, res) => {
    try{
        const { id } = req.params

        const userId = req.user?.id

        if(!userId) {
            return res.status(401).json({error: 'Autenticação necessaria!'})
        }

        if(!id){
            return res.status(400).json({error: 'ID inválido'})
        }

        const address = await Address.findOne({_id: id, createdBy: userId})

        if(!address) return res.status(404).json({error: 'Endereço não encontrado!'})

        await address.deleteOne()

        res.status(200).json({message: 'Endereço apagado com sucesso!'})

    } catch (error) {
        console.error(error)
        res.status(500).json({error: error || 'Erro ao deletar o endereço'})
    }
}