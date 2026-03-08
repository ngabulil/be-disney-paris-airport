const Trip = require("../models/trip.model");
const Location = require("../models/location.model");
const { formatResponse } = require("../format/response");

// CREATE TRIP
const createTrip = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation } = req.body;

        if (!pickupLocation || !dropoffLocation) {
            return formatResponse(
                res,
                400,
                "Pickup and dropoff locations are required",
                null,
                "Validation error"
            );
        }

        if (pickupLocation === dropoffLocation) {
            return formatResponse(
                res,
                400,
                "Pickup and dropoff locations cannot be the same",
                null,
                "Invalid request"
            );
        }

        // Validate pickup location
        const pickup = await Location.findOne({
            _id: pickupLocation,
            isDeleted: false
        });

        if (!pickup) {
            return formatResponse(
                res,
                404,
                "Pickup location not found",
                null,
                "Invalid location reference"
            );
        }

        // Validate dropoff location
        const dropoff = await Location.findOne({
            _id: dropoffLocation,
            isDeleted: false
        });

        if (!dropoff) {
            return formatResponse(
                res,
                404,
                "Dropoff location not found",
                null,
                "Invalid location reference"
            );
        }

        const trip = await Trip.create({
            pickupLocation,
            dropoffLocation
        });

        return formatResponse(res, 201, "Trip created successfully", trip);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET ALL TRIPS
const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ isDeleted: false })
            .populate("pickupLocation", "name locationType")
            .populate("dropoffLocation", "name locationType");

        return formatResponse(res, 200, "Trips retrieved successfully", trips);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET TRIP BY ID
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            isDeleted: false
        })
            .populate("pickupLocation", "name locationType")
            .populate("dropoffLocation", "name locationType");

        if (!trip) {
            return formatResponse(
                res,
                404,
                "Trip not found",
                null,
                "Not found"
            );
        }

        return formatResponse(res, 200, "Trip retrieved successfully", trip);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// UPDATE TRIP
const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!trip) {
            return formatResponse(
                res,
                404,
                "Trip not found",
                null,
                "Not found"
            );
        }

        const { pickupLocation, dropoffLocation } = req.body;

        if (pickupLocation) {
            const pickup = await Location.findOne({
                _id: pickupLocation,
                isDeleted: false
            });

            if (!pickup) {
                return formatResponse(
                    res,
                    404,
                    "Pickup location not found",
                    null,
                    "Invalid location reference"
                );
            }

            trip.pickupLocation = pickupLocation;
        }

        if (dropoffLocation) {
            const dropoff = await Location.findOne({
                _id: dropoffLocation,
                isDeleted: false
            });

            if (!dropoff) {
                return formatResponse(
                    res,
                    404,
                    "Dropoff location not found",
                    null,
                    "Invalid location reference"
                );
            }

            trip.dropoffLocation = dropoffLocation;
        }

        if (
            trip.pickupLocation.toString() ===
            trip.dropoffLocation.toString()
        ) {
            return formatResponse(
                res,
                400,
                "Pickup and dropoff locations cannot be the same",
                null,
                "Invalid request"
            );
        }

        await trip.save();

        return formatResponse(res, 200, "Trip updated successfully", trip);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// SOFT DELETE TRIP
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!trip) {
            return formatResponse(
                res,
                404,
                "Trip not found",
                null,
                "Not found"
            );
        }

        trip.isDeleted = true;
        trip.deletedAt = new Date();

        await trip.save();

        return formatResponse(res, 200, "Trip deleted successfully", null);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

module.exports = {
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    deleteTrip
};