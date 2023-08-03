const { Mutex } = require('async-mutex')

const qdrantLock = new Mutex();

module.exports = {
    qdrantLock
}

