const CustomErrorClass = require('./ErrorClass')
const {StatusCodes} = require('http-status-codes')

class UnauthenticatedClass extends CustomErrorClass {
    constructor(message) {
        super(message)
        this.status = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthenticatedClass