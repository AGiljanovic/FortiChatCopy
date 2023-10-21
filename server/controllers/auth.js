import bcrypt from "bcrypt";
import joi from 'joi';
import jwt from "jsonwebtoken";

import User from "../models/user.js";

/* 📜 Validation Schemas 📜 */
const registrationSchema = joi.object({
    firstName: joi.string().min(2).required(),
    lastName: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    picturePath: joi.string().uri().optional(),
    friends: joi.array().items(joi.string()),
    location: joi.string().optional(),
    occupation: joi.string().optional()   
});

const loginSchema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  }).options({ abortEarly: false });  

/* ✍🏼 Register New User ✍🏼 */
export const register = async (req, res) => {
    try {
        /* 📜 Input Validation 📜 */
        const { error } = registrationSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
          } = req.body;

        /* ⏱️ Check for Existing User ⏱️ */
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered." });
        }

        /* 🔐 Password Hashing 🔐 */
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
          });

        /* 💾 Save User & Prepare Response Data 💾 */
        const savedUser = await newUser.save();
        const { _id, firstName: fName, lastName: lName } = savedUser;

        /* 📤 Send Minimal User Data 📤 */
        res.status(201).json({ _id, firstName: fName, lastName: lName });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred. Please try again later." });
    }
};

/* 👤 Login User 👤 */
export const login = async (req, res) => {
    try {
        /* 📜 Input Validation 📜 */
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = req.body;

        /* 🔍 Find User by Email 🔍 */
        const user = await User.findOne({ email: email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ msg: "Invalid  password." });
        }

        /* 🎟 Generate JWT with Expiry 🎟 */
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        /* 📤 Send Minimal User Data 📤 */
        res.status(200).json({ token, user: { _id: user._id, firstName: user.firstName, lastName: user.lastName } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred. Please try again later." });
    }
};
