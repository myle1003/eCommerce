'use strict'

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
    singin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.signIn(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        // return res.status(201).json(await AccessService.signUp(req.body))
        new CREATED({
            message: 'Resiserted OK',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            }
        }).send(res)
    }

    singout = async (req, res, next) => {
        new SuccessResponse({
            message: "Singout successfully",
            metadata: await AccessService.singout({ keyStore: req.keyStore })
        }).send(res)
    }

    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Get token successfully",
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

}

module.exports = new AccessController()