const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary");
const path = require("path");
const fs = require("fs");
const supabase = require('../config/supabase');

// Configure dotenv with explicit path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const router = express.Router();

const storage = multer.memoryStorage();
var upload = multer({
    storage: storage
});

//Signup Route
const signup = async (req, res) => {
    try {
        console.log("Signup request received:", req.body);
        const { firstName, lastName, userBio, userEmail, userMobile, userName, userPassword } = req.body;

        // If current user exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(401).json({ error: "User already exists with this email" });
        }

        // Default profile image if none provided
        let profileImageUrl = 'default-profile.jpg';
        
        // Check if file is provided (but don't require it)
        if (req.file) {
            // Check if Cloudinary is properly configured
            if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                try {
                    // Try to upload to Cloudinary
                    const result = await cloudinary.uploader.upload(req.file.path);
                    profileImageUrl = result.secure_url;
                    console.log("Cloudinary upload result:", result);
                } catch (cloudinaryError) {
                    console.log("Cloudinary upload failed:", cloudinaryError);
                    // If Cloudinary upload fails, use local file storage as fallback
                    profileImageUrl = req.file.filename || 'default-profile.jpg';
                }
            } else {
                // Use local file storage if Cloudinary is not configured
                console.log("Cloudinary not configured, using local storage");
                profileImageUrl = req.file.filename || 'default-profile.jpg';
            }
        } else {
            console.log("No profile image provided, using default");
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const encryptedPassword = await bcrypt.hash(userPassword, salt);
        
        console.log("Creating new user with data:", {
            firstName, lastName, userBio, userEmail, 
            userMobile, userName, profileImage: profileImageUrl
        });

        const newUser = new User({
            firstName,
            lastName,
            userBio,
            userEmail,
            userMobile,
            userName,
            userPassword: encryptedPassword,
            profileImage: profileImageUrl
        });

        await newUser.save();
        console.log("New user saved:", newUser);

        return res.status(200).json({
            status: "Ok",
            user: newUser
        });

    } catch (error) {
        console.log("Signup error:", error);
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        console.log("Login request received:", req.body);
        const { userEmail, userPassword } = req.body;

        const user = await User.findOne({ userEmail });
        console.log("User found:", user ? user._id : "No user found");

        if (user) {
            const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
            console.log("Password match:", passwordMatch);
            
            if (passwordMatch) {
                return res.json(user);
            } else {
                return res.json({ status: "Error", getUser: false, message: "Invalid password" })
            }
        } else {
            return res.json({ status: "Error", getUser: false, message: "User not found" });
        }

    } catch (error) {
        console.log("Login error:", error);
        res.status(400).json({ error: error.message });
    }
};

const signUp = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
                emailRedirectTo: `${process.env.CLIENT_URL}/auth/callback`
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({
            message: "Registration successful! Please check your email to confirm your account.",
            user: data.user
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({
            message: "Login successful",
            session: data.session,
            user: data.user
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signOut = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            throw new Error(error.message);
        }

        if (!user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        res.status(200).json({ user });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.CLIENT_URL}/reset-password`,
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: "Password reset email sent" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { password } = req.body;

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const resendConfirmation = async (req, res) => {
    try {
        const { email } = req.body;

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: `${process.env.CLIENT_URL}/auth/callback`
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        res.status(200).json({
            message: "Confirmation email resent successfully!"
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signup,
    login,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    resetPassword,
    updatePassword,
    resendConfirmation
};