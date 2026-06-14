const mongoose = require("mongoose");

const terminalSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
    validate: {
      validator: async function (value) {
        const location = await mongoose.model("Location").findById(value);
        return location && location.locationType === "airport" && !location.isDeleted;
      },
      message: "Location must be airport"
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
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

module.exports = mongoose.model("Terminal", terminalSchema);