'use strict'

//!dmbg
const { model, Schema, Types, default: mongoose } = require('mongoose'); // Erase if already required
const slugify = require('slugify');

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
    p_thumb: String,
    p_slug: String,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop'
    },
    p_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
    p_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    p_variations: {
        type: Array,
        default: [],
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublic: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME_PRODUCT,
    timestamps: true
});

productSchema.index({ p_name: 'text', p_description: 'text' })

productSchema.pre('save', function (next) {
    this.p_slug = slugify(this.p_name, { lower: true })
    next()
})

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