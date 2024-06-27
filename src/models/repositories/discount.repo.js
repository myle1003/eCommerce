'use strict'

const {
    getSelectData, unGetSelectData
} = require('../../utils')

const findAllProductCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await model.find(filter)
        // .sort(sortBy)
        // .skip(skip)
        // .limit(limit)
        // .select(getSelectData(unSelect))
        .lean()

    return products
}

const findAllProductCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products
}

const checkDiscountExits = ({ model, filter }) => {
    return model.findOne(filter).lean()
}


module.exports = {
    findAllProductCodesUnSelect,
    findAllProductCodesSelect,
    checkDiscountExits
}