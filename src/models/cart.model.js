'use strict'
const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'cart'
const COLLECTION_NAME = 'carts'

const cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'complete', 'failed', 'pending'],
        default: 'active',
    },
    cart_products: { type: Array, required: true, default: [] },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: String, required: true }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})


module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema)
}