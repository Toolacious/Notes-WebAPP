// Validation
const Joi = require("@hapi/joi");

//Register Validate
const registerValidate = (data) => {
    const schema = {
        fname: Joi.string().max(50).required(),
        lname: Joi.string().max(50).required(),
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    };
    return Joi.validate(data, schema, { abortEarly: false });
};

//Login Validate
const loginValidate = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return Joi.validate(data, schema, { abortEarly: false });
};

module.exports.loginValidate = loginValidate;
module.exports.registerValidate = registerValidate;
