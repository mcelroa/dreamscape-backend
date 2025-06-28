const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password
        const hashed_password = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ email, hashed_password });

        // Save the user to database
        await user.save();

        res.status(201).json({ message: "Registration Successful" })
    } catch (e) {
        res.status(500).json({ error: "Registration Failed " })
    }
}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if user with email exists
        if (!user) return res.status(401).json({ error: "User with this email not found" });

        // Compare the password entered to that users password
        const passwordMatch = await bcrypt.compare(password, user.hashed_password);
        if (!passwordMatch) return res.status(401).json({ error: "Incorrect Password" })

        // Create a jwt
        const token = jwt.sign({ userId: user._id }, "jwt-secret", { expiresIn: "1h" })

        res.status(200).json(token);

    } catch (e) {
        res.status(500).json({ error: "Login Failed" })
    }
}