'use strict'

const shopModel = require("../models/shop.model")

const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, status: 1, roles: 1
} }) => {
    return await shopModel.findOne({ email }).select(select)
}

const createShop = async ({ name, email, password: passwordHash, roles }) => {
    return await shopModel.create({
        name, email, password: passwordHash, roles
    })
}

module.exports = {
    findByEmail,
    createShop
}