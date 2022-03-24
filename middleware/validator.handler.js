const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
    return (req, res, next) => {
        const data = req[property];
        // req.body = Si es post
        // req.params = Si es un get
        // req.query 
        const { error } = schema.validate(data);
        if (error) {
            next(boom.badRequest(error))
        }

        next();
    }
}

module.exports = validatorHandler;