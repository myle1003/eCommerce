'use strict'

const cart = require("../models/cart.model")

class CartService {

    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' }
        updateOrInsert = {
            $addToSet: {
                cart_prducts: product
            }
        }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            return await CartService.createUserCart({ userId, product })
        }

        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
    }
}

module.exports = CartService