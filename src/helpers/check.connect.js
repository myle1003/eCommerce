'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECOND = 5000
// count connect
const countConnect = () => {
    const numConnect = mongoose.connections.length
    console.log(`Number of connect ::${numConnect}`);
}

// check over load
const checkOverload = () => {
    setInterval ( () => {
        const numConnect = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss;
        // example maximum number of connections based on number ost cores
        const maxConnections = numCores * 5

        console.log(`Active connection:${numConnect}`);
        console.log(`Memory usage ::${memoryUsage/ 1024/ 1024} MB`);

        if (numConnect>maxConnections){
            console.log('Connection overload detected');
        }

    }, _SECOND ) // monitor every 5 seconds
}


module.exports = {
    countConnect,
    checkOverload
}