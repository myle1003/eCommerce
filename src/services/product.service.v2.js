'use strict'

const { BadRequestError } = require("../core/error.response");
const { product, electronic, clothing, furniture } = require("../models/product.model");
const { queryProduct, publicProductByShop, unPublicProductByShop, searchProduct, findAllProduct, findProduct, updateProductById } = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestdObjectParser } = require("../utils");

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

    static async findAllDarftsForShop({ p_shop_id, limit = 50, skip = 0 }) {
        const query = { p_shop_id, isDraft: true }
        return await queryProduct({ query, limit, skip })
    }

    static async findAllPublicForShop({ p_shop_id, limit = 50, skip = 0 }) {
        const query = { p_shop_id, isPublic: true }
        return await queryProduct({ query, limit, skip })
    }

    static async publicProductByShop({ p_shop_id, product_id }) {
        return await publicProductByShop({ p_shop_id, product_id })
    }

    static async unPublicProductByShop({ p_shop_id, product_id }) {
        return await unPublicProductByShop({ p_shop_id, product_id })
    }

    static async searchProduct({ keySearch }) {
        return await searchProduct({ keySearch })
    }

    static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { isPublic: true }, select = ['p_name', 'p_price', 'p_thumb'] }) {
        return await findAllProduct({ limit, sort, page, filter, select })
    }

    static async findProduct({ product_id, unSelect = ['__v', 'p_variations'] }) {
        return await findProduct({ product_id, unSelect })
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).updateProduct(productId)
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
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate: updateNestdObjectParser(bodyUpdate), model: product });
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

    async updateProduct(productId) {
        /**
         *  a: undefined
         *  b: null
         */
        const objectParams = removeUndefinedObject(this)

        if (objectParams.p_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestdObjectParser(objectParams.p_attributes), model: clothing });
        }

        const updateAttributes = await super.updateProduct(productId, updateNestdObjectParser(objectParams))
        return updateAttributes
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

    async updateProduct(productId) {
        /**
         *  a: undefined
         *  b: null
         */
        const objectParams = removeUndefinedObject(this)

        if (objectParams.p_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestdObjectParser(objectParams.p_attributes), model: electronic });
        }

        const updateAttributes = await super.updateProduct(productId, updateNestdObjectParser(objectParams))
        return updateAttributes
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

    async updateProduct(productId) {
        /**
         *  a: undefined
         *  b: null
         */
        const objectParams = removeUndefinedObject(this)

        if (objectParams.p_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestdObjectParser(objectParams.p_attributes), model: furniture });
        }

        const updateAttributes = await super.updateProduct(productId, updateNestdObjectParser(objectParams))
        return updateAttributes
    }
}


// register product types
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory