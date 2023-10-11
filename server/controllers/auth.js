import bcrypt from "bcrypt";
import User from "models/user.js";

/* ✍🏼 Register New User ✍🏼 */
export const register = async (req, res) => {
    try {
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

        /* 💾 Save uUser & Prepare Response Data 💾 */
        const savedUser = await newUser.save();
        const { _id, firstName: fName, lastName: lName, email: eMail, picturePath: pPath } = savedUser;
        
        /* 📤 Send Response With User Details 📤 */
        res.status(201).json({ _id, firstName: fName, lastName: lName, email: eMail, picturePath: pPath });

    } catch (err) {
        console.error(err);
        /* ⚠ Generic Error ⚠️ */
        res.status(500).json({ error: "An error occurred. Please try again later." });
    }
};

