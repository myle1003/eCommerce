'use strict'

// const ProductService = require('../services/product.service')
const ProductService = require('../services/product.service.v2')
const { SuccessResponse } = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct(req.body.p_type, {
                ...req.body,
                p_shop_id: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController()