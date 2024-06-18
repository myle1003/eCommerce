'use strict'

const { mongoose } = require('mongoose')
const { product, electronic, clothing, furniture } = require('../../models/product.model')

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('p_shop_id', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const searchProduct = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublic: true,
        $text: { $search: regexSearch }
    },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results
}

const publicProductByShop = async ({ p_shop_id, product_id }) => {
    const foundShop = await product.findOne({
        p_shop_id: new mongoose.Types.ObjectId(p_shop_id),
        _id: new mongoose.Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublic = true
    const { modifiesCount } = await foundShop.updateOne(foundShop)

    return modifiesCount
}

const unPublicProductByShop = async ({ p_shop_id, product_id }) => {
    const foundShop = await product.findOne({
        p_shop_id: new mongoose.Types.ObjectId(p_shop_id),
        _id: new mongoose.Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublic = false
    const { modifiesCount } = await foundShop.updateOne(foundShop)

    return modifiesCount
}

module.exports = { queryProduct, publicProductByShop, unPublicProductByShop, searchProduct }