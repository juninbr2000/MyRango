const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    available: {type: Boolean, required: true, default: true},
    category: {type: String, require: true, default: 'lanche'},
    price: {type: Number, required: true, min: 0},
    imageUrl: {type: String, default: ''},
    amount: {type: Number, min: 0},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

module.exports = mongoose.model("Product", ProductSchema)