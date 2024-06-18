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

    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await ProductService.findAllDarftsForShop({
                p_shop_id: req.user.userId
            })
        }).send(res)
    }

    getAllPublicForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Public success',
            metadata: await ProductService.findAllPublicForShop({
                p_shop_id: req.user.userId
            })
        }).send(res)
    }

    publicProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Public product success',
            metadata: await ProductService.publicProductByShop({
                product_id: req.params.id,
                p_shop_id: req.user.userId,
            })
        }).send(res)
    }

    unPublicProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'UnPublic product success',
            metadata: await ProductService.unPublicProductByShop({
                product_id: req.params.id,
                p_shop_id: req.user.userId,
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search product success',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res)
    }
}

module.exports = new ProductController()