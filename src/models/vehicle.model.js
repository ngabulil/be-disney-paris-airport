const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    photo: {
      type: String,
      required: true,
      trim: true
    },
    bookingType: {
      type: String,
      required: true,
      trim: true,
      enum: ["economy", "business"]
    },
    vehicleType: {
      type: String,
      required: true,
      trim: true,
      enum: ["car", "van"]
    },
    maxPassenger: {
      type: Number,
      required: true,
      trim: true
    },
    maxUnit: {
      type: Number,
      required: true,
      trim: true
    },
    maxStroller: {
      type: Number,
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
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);