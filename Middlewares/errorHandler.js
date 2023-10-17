const CustomErrorClass = require('../Exceptions/index')
const {StatusCodes} = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomErrorClass) {
        console.log(err.message)
        return res.status(err.status || 500).json({ error: err.message });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something went wrong try again later')

}

module.exports = errorHandlerMiddleware