'use strict'

const express = require('express')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const productController = require('../../controllers/product.controller')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

//authentication
router.use(authentication)
router.post('/create', asyncHandler(productController.createProduct))
router.post('/public/:id', asyncHandler(productController.publicProductByShop))
router.post('/unpublic/:id', asyncHandler(productController.unPublicProductByShop))


router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.get('/publics/all', asyncHandler(productController.getAllPublicForShop))

module.exports = router