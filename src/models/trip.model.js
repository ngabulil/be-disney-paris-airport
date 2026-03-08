const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    pickupLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
    },
    dropoffLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
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

module.exports = mongoose.model("Trip", tripSchema);