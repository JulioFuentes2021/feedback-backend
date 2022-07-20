const boom = require('@hapi/boom');

function catchError(err, req, res, next) {
    next(err)
}

function handleError(err, req, res, next) {
    // res.status(404).json({
    //     message: err.message,
    //     stack: err.stack
    // })

    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload)
    } else {
        res.status(404).json({
            message: err.message,
            stack: err.stack
        })
    }
}

module.exports = { catchError, handleError }