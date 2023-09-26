/*
The Mutex Key is used to prevent a race condition during Qdrant collection creation
if two users are onboarding at the same time
*/
const { Mutex } = require('async-mutex')
const qdrantLock = new Mutex()

module.exports = {
    qdrantLock
}

