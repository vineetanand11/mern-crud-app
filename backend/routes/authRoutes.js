const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const router = express.Router();


/* Register */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, age, city} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        
        const userRole = (role == undefined || role) ? 'user': role;

        const formData = {
            name, 
            email,
            password: hashPassword,
            role: userRole,
            age,
            city
        };

        const user = await User.create(formData);
        const { password: _, ...userData } = user.toObject();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({token, user: userData});
    } catch (err) {
        console.error("Register error: ", err.message);

        // Handle Mongoose validation errors

        if (err.name === 'ValidationError') {
            const errors = {};
            Object.keys(err.errors).forEach((key) => {
                if (err.errors[key].name === "CastError") {
                    if (key === "age") {
                        errors[key] = "Age must be a valid number";
                    } else if (key === "city") {
                        errors[key] = "Please select a valid city";
                    } else {
                        errors[key] = `Invalid ${key} format`;
                    }
                } else {
                    errors[key] = err.errors[key].message;
                }
            });
            return res.status(400).json({ errors }); 
        }

        // Handle duplicate key error (email already exists)
        if (err.code === 11000) {
            return res.status(409).json({ 
                errors: { email: "Email already exists" }
            });
        }
        
        return res.status(500).json({ message: "Server error" });
    }
    
});

/* Login */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({errors: {
                ...((!email) && {email: "Email is required"}),
                ...((password) && {password: "Password is required"})
            }});
        }

        const user = await User.findOne({ email}).select("+password");
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                errors: { 
                    general: "Invalid credentials" 
                }
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({
            token,
            user: userObj
        });

    } catch (err) {
        console.error("Log error:", err);
        res.status(500).json({ message: "Server error" });
    }
    
});

module.exports = router;
