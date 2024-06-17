'use strict'

const { BadRequestError } = require("../core/error.response");
const { product, electronic, clothing, furniture } = require("../models/product.model")

class ProductFactory {
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).createProduct()
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

    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.p_attributes,
            p_shop_id: this.p_shop_id
        })
        if (!newClothing) throw new BadRequestError('create new clothing failed')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new clothing failed')

        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectrinic = await electronic.create({
            ...this.p_attributes,
            p_shop_id: this.p_shop_id
        })
        if (!newElectrinic) throw new BadRequestError('create new electronic failed')

        const newProduct = await super.createProduct(newElectrinic._id)
        if (!newProduct) throw new BadRequestError('create new electronic failed')

        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.p_attributes,
            p_shop_id: this.p_shop_id
        })
        if (!newFurniture) throw new BadRequestError('create new furniture failed')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new furniture failed')

        return newProduct
    }
}


// register product types
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory