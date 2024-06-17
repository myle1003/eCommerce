'use strict'

//!dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME_PRODUCT = 'product'
const COLLECTION_NAME_PRODUCT = 'product'
const DOCUMENT_NAME_CLOTHING = 'clothing'
const COLLECTION_NAME_CLOTHING = 'clothing'
const DOCUMENT_NAME_ELECTRONIC = 'electronic'
const COLLECTION_NAME_ELECTRONIC = 'electronic'
const DOCUMENT_NAME_FURNITURE = 'furniture'
const COLLECTION_NAME_FURNITURE = 'furniture'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    p_name: {
        type: String,
        required: true
    },
    p_thumb: {
        type: String,
        required: true
    },
    p_description: {
        type: String,
    },
    p_price: {
        type: Number,
        required: true,
    },
    p_quantity: {
        type: Number,
        required: true,
    },
    p_type: {
        type: String,
        required: true,
        enum: ['Electrinic', 'Clothing', 'Furniture']
    },
    p_shop_id: {
        type: Types.ObjectId,
        ref: 'Shop'
    },
    p_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
}, {
    collection: COLLECTION_NAME_PRODUCT,
    timestamps: true
});


const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
}, {
    collection: COLLECTION_NAME_CLOTHING,
    timestamps: true
})

const electrinicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true,
    },
    model: String,
    color: String,
}, {
    collection: COLLECTION_NAME_ELECTRONIC,
    timestamps: true
})

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
}, {
    collection: COLLECTION_NAME_FURNITURE,
    timestamps: true
})

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME_PRODUCT, productSchema),
    electronic: model(DOCUMENT_NAME_ELECTRONIC, electrinicSchema),
    clothing: model(DOCUMENT_NAME_CLOTHING, clothingSchema),
    furniture: model(DOCUMENT_NAME_FURNITURE, furnitureSchema),
}