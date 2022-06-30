const Joi = require('joi');

const title = Joi.string()
const feature = Joi.string()
const description = Joi.string().max(250);
const username = Joi.string().min(3).max(20);
const password = Joi.string().min(3).max(15);
const mail = Joi.string().min(3).max(15);

const createFeedbackValidation = Joi.object({
    title: title.required(),
    feature: feature.required(),
    description: description.required(),
});

const loginAndSignInValidator = Joi.object({
    password: password.required(),
    username: username.required(),
    mail: mail.required(),
})

const loginValidator = Joi.object({
    password: password.required(),
    username: username.required(),
    mail: mail.required(),
})

module.exports = { createFeedbackValidation, loginAndSignInValidator }