'use strict'

const _ = require('lodash')

const getIntoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds)
}

// ['a', 'b']= {a:1, b:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

// ['a', 'b']= {a:0, b:0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null) {
            delete obj[key];
        }
    })
    return obj;
}
/**
 * 
 * c: {
 * d: 1}
 * 
 * `c.d`: 1
 */

const updateNestdObjectParser = obj => {
    const final = {}
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestdObjectParser(obj[key])
            Object.keys(response).forEach(a => {
                final[`${key}.${a}`] = response[a]
            })

        } else {
            final[key] = obj[key]
        }
    })
    return final;
}

module.exports = {
    getIntoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestdObjectParser
}