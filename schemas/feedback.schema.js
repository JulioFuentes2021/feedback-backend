const Joi = require('joi');

const title = Joi.string()
const feature = Joi.string()
const description = Joi.string().max(250);
const username = Joi.string().alphanum().min(3).max(10);
const password = Joi.string().alphanum().min(3).max(15);

const createFeedbackValidation = Joi.object({
    title: title.required(),
    feature: feature.required(),
    description: description.required(),
});

const loginAndSignInValidator = Joi.object({
    username: username.required(),
    password: password.required(),
})



module.exports = { createFeedbackValidation, loginAndSignInValidator }