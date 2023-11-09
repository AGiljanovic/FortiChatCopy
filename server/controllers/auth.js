import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import joi from 'joi';
import sanitize from "mongo-sanitize";

/* 🖨️ Joi Validation Schemas 🖨️ */
const registerSchema = joi.object({
  firstName: joi.string().min(2).max(50).required(),
  lastName: joi.string().min(2).max(50).required(),
  email: joi.string().email().max(50).required(),
  password: joi.string().min(5).required(),
  picturePath: joi.string().allow('', null),
  friends: joi.array().items(joi.string().alphanum()),
  location: joi.string().optional(),
  occupation: joi.string().optional(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

/* 🧍‍♀️Register User 🧍‍♀️ */
export const register = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { error, value } = registerSchema.validate(sanitizedBody);
    if (error) {
      return res.status(400).json({ error: "Invalid registration data provided." });
    }

    value.email = value.email.toLowerCase();
    const passwordHash = await bcrypt.hash(value.password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email: value.email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

/* ⏰ Logging In ⏰ */
export const login = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    const { error, value } = loginSchema.validate(sanitizedBody);
    if (error) {
      return res.status(400).json({ error: "Invalid login data provided." });
    }
    value.email = value.email.toLowerCase();

    const user = await User.findOne({ email: value.email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};
