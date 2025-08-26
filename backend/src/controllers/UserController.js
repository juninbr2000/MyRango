const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

function verifyCPF (cpf) {
    cpf = cpf.replace(/\D/g, '');

    let soma
    let resto

    if(cpf === '00000000000') return false
    soma = 0
    for(i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11

    if(resto === 11 || resto === 10) resto = 0
    if(resto !== parseInt(cpf.substring(9, 10)) ) return false

    soma = 0 
    for(i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
    resto  = (soma * 10 ) % 11

    if(resto === 11 || resto === 10) resto = 0
    if(resto !== parseInt(cpf.substring(10, 11)) ) return false

    return true
}

exports.register = async (req, res) => {
    try {
        const {name, phone, cpf, password} = req.body

        if(!name || !cpf || !password){
            return res.status(400).json({error: 'Campos ausentes!'})
        }

        const CPFValid = verifyCPF(cpf)

        if(!CPFValid) {
            return res.status(400).json({error: 'CPF invalido!'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({name, phone, cpf, password: hashedPassword})

        await user.save()

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET )

        return res.status(201).json({token, user: {id: user._id, name: user.name, phone: user.phone, cpf: user.cpf, }})
    } catch ( error ) {
        console.error(error)
        if (error.code === 11000) { // O código 11000 é para erros de campo único no MongoDB
            return res.status(409).json({ error: 'CPF já cadastrado.' });
        }
        res.status(500).json({error: error || 'Erro de Servidor'})
    }
}

exports.login = async (req, res) => {
    try {
        const {validator, password} = req.body 

        if(!validator || !password) {
            return res.status(400).json({error: 'Campos ausentes!'})
        }

        const isCPF = verifyCPF(validator)
        
        const user = await User.findOne(isCPF ? {cpf: validator} : {name: validator} )

        if(!user) {
            return res.status(404).json({error: 'Usuario não encontrado'})
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.status(400).json({error: 'Senha Incorreta!'})
        }

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET)

        res.status(200).json({token, user:{ id: user._id, name: user.name, phone: user.phone, cpf: user.cpf }})

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error || "Error de servidor" })
    }
}