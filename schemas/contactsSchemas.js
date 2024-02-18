import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
  favorite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.number(),
  favorite: Joi.boolean(),
})
  .min(1)
  .message("Body must have at least one field");
