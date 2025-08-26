const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    cpf: {type: String, required: true, unique: true},
    phone: {type: String, unique: true },
    role: {type: String, enum: ['admin', 'user'], default: 'user', required: true},
    password: {type: String, required: true}
})

module.exports = mongoose.model("User", UserSchema)