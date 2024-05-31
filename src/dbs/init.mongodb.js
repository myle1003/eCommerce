'use strict'

const mongoose = require('mongoose')
const {db: {host, name, port}} = require('../configs/config.mongodb')
const connectSTring = `mongodb://${host}:${port}/${name}`
console.log(connectSTring);

class Database {
    constructor(){
        this.connect()
    }

    //connect
    connect(type = 'mongodb'){
        if(1===1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color:true})
        }

        mongoose.connect(connectSTring, {maxPoolSize : 50}).then(_=> console.log('Connect MongoDb Success'))
        .catch(err=> console.log('Error Connect!'))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongdb = Database.getInstance()

module.exports = instanceMongdb