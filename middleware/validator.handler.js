const boom = require('@hapi/boom');
const Joi = require('joi');

function validatorHandler(schema, property) {
    return (req, res, next) => {
        const data = req[property];
        // req.body = Si es post
        // req.params = Si es un get
        // req.query 
        const { error } = schema.validate(data);
        console.log('ERROR: ', error)
        if (error) {
            next(boom.badRequest(error))
        }

        next();
    }
}

function customValidator(param, schema) {
    return (req, res, next) => {

        const { sort } = req.params;

        const { error } = schema.validate(sort)

        if (error) {
            next(boom.badRequest(`${param} param must be one of [asc, desc, 1, -1]`))
        }

        next()
    }
}

module.exports = { validatorHandler, customValidator };