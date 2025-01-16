const UserModel = require("../Models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Signup function
const signup = async (req, res) => {
    try {
        let { name, surname, email, password, address, mobile, dob, role } = req.body;

        role = role || "user";

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists...", success: false });
        }
        const userModel = new UserModel({ name, surname, email, password, address, mobile, dob, role });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201).json({ message: "Signup successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
// Login function with enhancements
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required.", success: false });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: "Invalid credentials.", success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Invalid credentials.", success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successfully",
            success: true,
            token: jwtToken,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get user by email (from token)
const getUserByEmail = async (req, res) => {
    const token = req.headers.authorization; // Correctly extract token

    if (!token) {
        return res.status(403).json({ message: "No token provided", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({
            success: true,
            name: user.name,
            surname: user.surname,
            email: user.email,
            mobile: user.mobile,
            dob: user.dob,
            address: user.address,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


module.exports = {
    signup,
    login,
    getUserByEmail,
};
