const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    address: {
        rua: String,
        numero: String,
        bairro: String,
        cidade: String,
        estado: String,
        cep: String,
        complemento: String
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            priceAtTimeOfPurchase: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {type: Number, required: true},
    ProductStatus: {type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending'},
    paymentStatus: {type: String, enum: ['pending', 'paid', 'failed'], default: 'pending'},
    paymentMethod: { type: String, enum: ['pix', 'cash', 'credit_card'], required: true }
}, {timestamps: true})

OrderSchema.pre('save', function(next) {
    this.totalPrice = this.products.reduce((acc, item) => acc + (item.priceAtTimeOfPurchase * item.quantity), 0)
    next()
})

module.exports = mongoose.model( 'Order', OrderSchema )