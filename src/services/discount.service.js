'use strict'

const { BadRequestError, NotFoundRequestError } = require("../core/error.response")
const discount = require("../models/discount.model")
const { product } = require("../models/product.model")
const { findAllProductCodesUnSelect, checkDiscountExits } = require("../models/repositories/discount.repo")
const { findAllProduct } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb, getSelectData } = require("../utils")

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload

        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discoungt code has expried')
        // }

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start_date must be before end_date')
        }

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        })

        if (foundDiscount && foundDiscount.is_active) {
            throw new BadRequestError('Discount code already exists')
        }

        const newDiscount = await discount.create({
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_is_active: is_active,
            discount_shopId: convertToObjectIdMongodb(shopId),
            discount_min_order_value: min_order_value || 0,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
            discount_applies_to: applies_to,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_max_uses_per_user: max_uses_per_user,
        })

        return newDiscount
    }

    static async updateDiscountCode() {

    }

    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundRequestError("discount not found")
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            // get all product
            products = await findAllProduct({
                filter: {
                    p_shop_id: convertToObjectIdMongodb(shopId),
                    isPublic: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ['p_name']
            })
                .lean()
        }

        if (discount_applies_to === 'specific') {
            //get the products id

            products = await product.find({
                isPublic: true,
                _id: {
                    $in: discount_product_ids
                },
            })
                .limit(limit)
                .skip(page * limit)
                .sort('ctime' ? { _id: -1 } : { _id: 1 })
                .select(getSelectData(['p_name', '_id']))
                .lean()
        }
        return products
    }

    /** 
     * get all discount code of shop
     */

    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        const discountCodes = await findAllProductCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                diacount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })
        return discountCodes
    }

    /**
     * Apply discount code
     */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExits({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundRequestError("discount dose not exist")

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value
        } = foundDiscount

        if (!discount_is_active) throw new NotFoundRequestError("discount expried!")
        if (!discount_max_uses) throw new NotFoundRequestError("discount are out")

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundRequestError('discount ecode has expried')
        }

        let totalOrder = 0
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) throw new NotFoundRequestError(`order value is too low ${discount_min_order_value}`)
        }
        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(userId => userId.userId === userId)
            if (userUserDiscount) {
                throw new NotFoundRequestError(`user used the discount`)
            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted
    }

    static async cancelDiscount({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExits({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundRequestError("discount dose not exist")

        const result = await discount.fiindByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result


    }

}
module.exports = DiscountService