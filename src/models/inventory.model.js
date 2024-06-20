'use strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'inventory'
const COLLECTION_NAME = 'inventory'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: "product" },
    inven_location: { type: String, default: "unknow" },
    inven_stock: { type: Number, require: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "shop" },
    inven_reservations: { type: Array, default: [] },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);