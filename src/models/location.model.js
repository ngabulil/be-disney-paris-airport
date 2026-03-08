const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    locationType: {
        type: String,
        required: true,
        enum: ["airport", "hotel", "place"]
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("Location", locationSchema);