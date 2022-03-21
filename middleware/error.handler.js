function catchError(err, req, res, next) {
    next(err)
}

function handleError(err, req, res, next) {
    res.status(404).json({
        message: err.message,
        stack: err.stack
    })
}

module.exports = { catchError, handleError }