'use strict'

// const DiscountService = require('../services/discount.service')
const { SuccessResponse } = require("../core/success.response")
const DiscountService = require("../services/discount.service")

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create discount code successfully',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all discount codes successfully',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'get discount code successfully',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all discount code with product successfully',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}

module.exports = new DiscountController()