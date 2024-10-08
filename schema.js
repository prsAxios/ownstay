const Joi = require ('joi');

module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(99),
        image: Joi.string().allow("",null), 
        country: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        // name: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});