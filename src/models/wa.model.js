const mongoose = require("mongoose");

const waSchema = new mongoose.Schema({
    keyNumberPersonal: {
        type: String,
        required: true,
        trim: true
    },
    keyNumberBusiness: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Wa", waSchema);