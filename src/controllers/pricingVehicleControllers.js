const PricingVehicle = require("../models/pricingVehicle.model");
const Trip = require("../models/trip.model");
const Vehicle = require("../models/vehicle.model");
const { formatResponse } = require("../format/response");

// CREATE PRICING
const createPricingVehicle = async (req, res) => {
    try {
        const { trip, vehicle, price } = req.body;

        if (!trip || !vehicle || price == null) {
            return formatResponse(
                res,
                400,
                "Trip, vehicle and price are required",
                null,
                "Validation error"
            );
        }

        // Validate Trip
        const existingTrip = await Trip.findOne({
            _id: trip,
            isDeleted: false
        });

        if (!existingTrip) {
            return formatResponse(
                res,
                404,
                "Trip not found",
                null,
                "Invalid trip reference"
            );
        }

        // Validate Vehicle
        const existingVehicle = await Vehicle.findOne({
            _id: vehicle,
            isDeleted: false
        });

        if (!existingVehicle) {
            return formatResponse(
                res,
                404,
                "Vehicle not found",
                null,
                "Invalid vehicle reference"
            );
        }

        // Prevent duplicate pricing
        const duplicate = await PricingVehicle.findOne({
            trip,
            vehicle,
            isDeleted: false
        });

        if (duplicate) {
            return formatResponse(
                res,
                400,
                "Pricing already exists for this trip and vehicle",
                null,
                "Duplicate data"
            );
        }

        const pricing = await PricingVehicle.create({
            trip,
            vehicle,
            price
        });

        return formatResponse(
            res,
            201,
            "Pricing vehicle created successfully",
            pricing
        );

    } catch (error) {
        return formatResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

// GET ALL PRICING
const getAllPricingVehicle = async (req, res) => {
    try {
        const pricing = await PricingVehicle.find({ isDeleted: false })
            .populate({
                path: "trip",
                populate: [
                    { path: "pickupLocation", select: "name locationType" },
                    { path: "dropoffLocation", select: "name locationType" }
                ]
            })
            .populate("vehicle", "name bookingType vehicleType");

        return formatResponse(
            res,
            200,
            "Pricing vehicles retrieved successfully",
            pricing
        );

    } catch (error) {
        return formatResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

// GET BY ID
const getPricingVehicleById = async (req, res) => {
    try {
        const pricing = await PricingVehicle.findOne({
            _id: req.params.id,
            isDeleted: false
        })
            .populate({
                path: "trip",
                populate: [
                    { path: "pickupLocation", select: "name locationType" },
                    { path: "dropoffLocation", select: "name locationType" }
                ]
            })
            .populate("vehicle", "name bookingType vehicleType");

        if (!pricing) {
            return formatResponse(
                res,
                404,
                "Pricing vehicle not found",
                null,
                "Not found"
            );
        }

        return formatResponse(
            res,
            200,
            "Pricing vehicle retrieved successfully",
            pricing
        );

    } catch (error) {
        return formatResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

// UPDATE PRICING
const updatePricingVehicle = async (req, res) => {
    try {
        const pricing = await PricingVehicle.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!pricing) {
            return formatResponse(
                res,
                404,
                "Pricing vehicle not found",
                null,
                "Not found"
            );
        }

        const { price } = req.body;

        if (price != null) pricing.price = price;

        await pricing.save();

        return formatResponse(
            res,
            200,
            "Pricing vehicle updated successfully",
            pricing
        );

    } catch (error) {
        return formatResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

// SOFT DELETE
const deletePricingVehicle = async (req, res) => {
    try {
        const pricing = await PricingVehicle.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!pricing) {
            return formatResponse(
                res,
                404,
                "Pricing vehicle not found",
                null,
                "Not found"
            );
        }

        pricing.isDeleted = true;
        pricing.deletedAt = new Date();

        await pricing.save();

        return formatResponse(
            res,
            200,
            "Pricing vehicle deleted successfully",
            null
        );

    } catch (error) {
        return formatResponse(
            res,
            500,
            "Internal server error",
            null,
            error.message
        );
    }
};

module.exports = {
    createPricingVehicle,
    getAllPricingVehicle,
    getPricingVehicleById,
    updatePricingVehicle,
    deletePricingVehicle
};