const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    cidade: {type: String, required: true},
    cep: {type: String, required: true},
    rua: {type: String, required: true},
    complemento: {type: String, required: true},
    referencia: {type: String},
    bairro: {type: String, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

module.exports = mongoose.model( 'Address', AddressSchema )