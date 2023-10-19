
const {StatusCodes} = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        // set default
        statusCode: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later',
    }
    // if (err instanceof CustomErrorClass) {
    //     return res.status(err.status || 500).json({ error: err.message });
    // }
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`
        customError.statusCode = 400
    }
    return res.status(customError.statusCode).json({ msg: customError.msg })

}

module.exports = errorHandlerMiddleware