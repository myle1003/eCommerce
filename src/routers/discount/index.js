'use strict'

const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const discountController = require('../../controllers/discount.controler')
const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProduct))

//authentication
router.use(authentication)
router.get('/', asyncHandler(discountController.getAllDiscountCode))
router.post('/', asyncHandler(discountController.createDiscountCode))

module.exports = router