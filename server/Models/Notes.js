const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    fileDescription: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: true,
    },
    files: {
        type: String,
        required: true,
    },
    cloudinaryPublicId: {
        type: String,
        required: false,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

});

module.exports = mongoose.model("Notes", NoteSchema);