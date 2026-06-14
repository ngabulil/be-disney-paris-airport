const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema({
    discount: {
        type: Number,
        required: true,
        trim: true,
    },
    promoCode: {
        type: String,
        required: true,
        trim: true,
    },
    allowedTripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
    },
    allowedBookingType: {
        type: String,
        enum: ["economy", "business"]
    },
    roundtrip: {
        type: Boolean,
    },
    isValid: {
        type: Boolean,
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

module.exports = mongoose.model("Promo", promoSchema);