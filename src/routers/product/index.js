'use strict'

const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const productController = require('../../controllers/product.controller')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('/allproduct', asyncHandler(productController.findAllProduct))
router.get('/:product_id', asyncHandler(productController.findProduct))

//authentication
router.use(authentication)
router.post('/create', asyncHandler(productController.createProduct))
router.post('/public/:id', asyncHandler(productController.publicProductByShop))
router.post('/unpublic/:id', asyncHandler(productController.unPublicProductByShop))
router.patch('/:productId', asyncHandler(productController.updateProduct))


router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.get('/publics/all', asyncHandler(productController.getAllPublicForShop))

module.exports = router