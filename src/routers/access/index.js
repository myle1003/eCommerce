'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

//singup
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/signin', asyncHandler(accessController.singin))

//authentication
router.use(authentication)
router.post('/shop/signout', asyncHandler(accessController.singout))

module.exports = router