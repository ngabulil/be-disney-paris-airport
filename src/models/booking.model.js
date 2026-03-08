    const mongoose = require("mongoose");

    const bookingSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
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
        pickupHotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        },
        dropoffHotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
        },
        pickupTerminal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Terminal",
        },
        dropoffTerminal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Terminal",
        },
        pickupFlightNumber: {
            type: String,
            trim: true,
        },
        dropoffFlightNumber: {
            type: String,
            trim: true,
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
            trim: true,
        },
        roundtrip: {
            type: Boolean,
            required: true,
        },
        passengers: {
            type: Number,
            required: true,
        },
        suitcases: {
            type: Number,
            required: true,
        },
        handLuggage: {
            type: Number,
            required: true
        },
        strollers: {
            type: Number,
            required: true
        },
        babySeats: {
            type: Number,
            required: true,
        },
        boosterSeats: {
            type: Number,
            required: true,
        },
        childSeats: {
            type: Number,
            required: true,
        },
        pickupDateOut: {
            type: Date,
            required: true,
            trim: true,
        },
        pickupDateReturn: {
            type: Date,
            required: function () {
                return this.roundtrip;
            },
        },
        totalPrice: {
            type: Number,
            required: true,
            trim: true,
        },
        statusTrip: {
            type: String,
            required: true,
            trim: true,
            default: "pending",
            enum: ["pending", "confirmed", "cancelled", "completed"]
        },
        statusPayment: {
            type: Boolean,
            required: true,
            default: false
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true,
            enum: ["cash", "card", "paypal", "applepay"]
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

    module.exports = mongoose.model("Booking", bookingSchema);