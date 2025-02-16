'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'discount'
const COLLECTION_NAME = 'discount'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, //percentage
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true },
    discount_users_used: { type: Array, default: [] },
    discount_max_uses_per_user: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'shop' },

    discount_is_active: { type: Boolean, required: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }, // so sq dc ap dung



}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);