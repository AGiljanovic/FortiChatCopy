import Joi from 'joi';

/* 🎯 Input Validation Schemas 🎯 */
const userIdSchema = Joi.object({
  id: Joi.string().alphanum().min(24).max(24).required(),
}).options({ abortEarly: false });

const friendIdSchema = Joi.object({
  id: Joi.string().alphanum().min(24).max(24).required(),
  friendId: Joi.string().alphanum().min(24).max(24).required(),
}).options({ abortEarly: false });

/* 🧪 Input Validation 🧪  */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      return res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
    }
    next();
  };
}

export { validate, userIdSchema, friendIdSchema };
