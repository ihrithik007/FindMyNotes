const express = require("express");
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const multer = require("multer");
const path = require("path");
const { uploadNote, getNote, getNoteByID, deleteNote } = require("../Controllers/NotesController");
const { requireAuth } = require("../middleware/auth");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Health check endpoint to verify Supabase connection
router.get('/health', async (req, res) => {
  try {
    // Try to make a simple query to test the connection
    const { data, error } = await supabase.from('notes').select('count').limit(1);
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      message: 'Successfully connected to Supabase',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Supabase connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to Supabase',
      details: error.message
    });
  }
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    // Define allowed file types
    const allowedTypes = [
      'application/pdf', // PDF
      'application/msword', // DOC
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/vnd.ms-powerpoint', // PPT
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
      'text/plain', // TXT
      'image/jpeg', // JPG
      'image/png', // PNG
      'image/gif' // GIF
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed types: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG, GIF'));
    }
  }
});

// Protected routes - require authentication
router.post("/upload", requireAuth, upload.single("file"), uploadNote);
router.get("/search", requireAuth, getNote);
router.get("/user/:id", requireAuth, getNoteByID);
router.delete("/:id", requireAuth, deleteNote);

module.exports = router;