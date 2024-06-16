'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { authentication } = require('../../auth/authUtils')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

//singup
router.post('/signup', asyncHandler(accessController.signUp))
router.post('/signin', asyncHandler(accessController.singin))

//authentication
router.use(authentication)
router.post('/signout', asyncHandler(accessController.singout))
router.post('/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router