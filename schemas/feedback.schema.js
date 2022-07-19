const Joi = require("joi");

const title = Joi.string().min(3).max(20);
const feature = Joi.string();
const description = Joi.string().max(250);
const username = Joi.string().min(3).max(20);
const password = Joi.string().min(3).max(35);
const mail = Joi.string().min(3).max(35);

const createFeedbackValidation = Joi.object({
    title: title.required(),
    feature: feature.required(),
    description: description.required(),
});

const loginAndSignInValidator = Joi.object({
    password: password.required(),
    username: username.required(),
    mail: mail.required(),
});

const loginValidation = Joi.object({
    password: password.required(),
    username: username.required(),
    // mail: mail.required(),
});

const validateSchemaSortParams = Joi.any().valid("asc", "desc", "1", "-1")

module.exports = {
    createFeedbackValidation,
    loginAndSignInValidator,
    validateSchemaSortParams,
    loginValidation
};
