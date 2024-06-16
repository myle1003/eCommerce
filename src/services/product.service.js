'use strict'

const { BadRequestError } = require("../core/error.response");
const { product, electronic, clothing } = require("../models/product.model")

class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronic':
                return new Electronic(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid product type ${type}`)
        }
    }
}

class Product {
    constructor({
        p_name, p_thumb, p_description, p_price, p_quantity, p_type, p_shop_id, p_attributes
    }) {
        this.p_name = p_name;
        this.p_thumb = p_thumb;
        this.p_description = p_description;
        this.p_price = p_price;
        this.p_quantity = p_quantity;
        this.p_type = p_type;
        this.p_shop_id = p_shop_id;
        this.p_attributes = p_attributes;
    }

    async createProduct() {
        return await product.create(this)
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.p_attributes)
        if (!newClothing) throw new BadRequestError('create new clothing failed')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new clothing failed')

        return newProduct
    }
}

class Electrinic extends Product {
    async createProduct() {
        const newElectrinic = await electronic.create(this.p_attributes)
        if (!newElectrinic) throw new BadRequestError('create new electronic failed')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new electronic failed')

        return newProduct
    }
}


module.exports = ProductFactory