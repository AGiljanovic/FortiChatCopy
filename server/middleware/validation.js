import joi from 'joi';

const registerValidationSchema = joi.object({
  firstName: joi.string().min(2).max(50).required(),
  lastName: joi.string().min(2).max(50).required(),
  email: joi.string().email().max(50).required(),
  password: joi.string().min(5).required(),
  picturePath: joi.string().optional().allow(''),
  friends: joi.array().items(joi.string().alphanum()).optional(),
  location: joi.string().optional().allow(''),
  occupation: joi.string().optional().allow(''),
});

const loginValidationSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

/* 🪿 Validate Path Parameters as MongoDB ObjectIds 🪿 */
const objectIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const userParamsSchema = joi.object({
  id: objectIdSchema.required(),
  friendId: objectIdSchema.optional(),
});

const postCreationSchema = joi.object({
  userId: joi.string().required(),
  description: joi.string().max(500).optional(),
  picturePath: joi.string().optional().allow(''),
  userPicturePath: joi.string().optional().allow(''),
});

export const validateRegistrationData = (req, res, next) => {
  const { error } = registerValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(x => x.message).join(', ') });
  }
  req.body.email = req.body.email.toLowerCase();
  next();
};

export const validateLoginData = (req, res, next) => {
  const { error } = loginValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(x => x.message).join(', ') });
  }
  req.body.email = req.body.email.toLowerCase();
  next();
};

export const validateUserParams = (req, res, next) => {
  const { error } = userParamsSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
  }

  next();
};

export const validatePostCreation = (req, res, next) => {
  const { error } = postCreationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(x => x.message).join(', ') });
  }
  next();
};
