const CustomErrorClass = require('./ErrorClass')
const {StatusCodes} = require('http-status-codes')
class BadRequest extends CustomErrorClass {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequest