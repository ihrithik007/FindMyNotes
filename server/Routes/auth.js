const express = require("express");
const router = express.Router();
const {
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    resetPassword,
    updatePassword,
    resendConfirmation
} = require("../Controllers/AuthController");
const multer = require("multer");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const path = require("path");
const fs = require("fs");

// Configure dotenv with explicit path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Make sure the images directory exists
const imagesDir = path.join(__dirname, '../images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('Created images directory:', imagesDir);
}

// For development without Cloudinary, we'll provide default empty values if not set
// This allows the server to start even without Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file) {
            if (
                file.mimetype == "image/png" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg"
            ) {
                callback(null, true);
            } else {
                console.log("Only jpg & png files are supported");
                callback(null, false);
            }
        } else {
            callback(null, true);
        }
    }
});

// Authentication routes
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.get("/me", getCurrentUser);
router.post("/reset-password", resetPassword);
router.post("/update-password", updatePassword);
router.post("/resend-confirmation", resendConfirmation);

// Express static middleware to serve images
router.use('/images', express.static(path.join(__dirname, '../images')));

module.exports = router;