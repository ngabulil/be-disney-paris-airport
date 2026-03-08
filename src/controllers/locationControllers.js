const Location = require("../models/location.model");
const { formatResponse } = require("../format/response");

// CREATE LOCATION
const createLocation = async (req, res) => {
    try {
        const { name, locationType } = req.body;

        if (!name || !locationType) {
            return formatResponse(
                res,
                400,
                "Location name and location type are required",
                null,
                "Validation error"
            );
        }

        const location = await Location.create({
            name,
            locationType,
        });

        return formatResponse(res, 201, "Location created successfully", location);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET ALL LOCATIONS (not deleted)
const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find({ isDeleted: false });

        return formatResponse(res, 200, "Locations retrieved successfully", locations);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET LOCATION BY ID
const getLocationById = async (req, res) => {
    try {
        const location = await Location.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!location) {
            return formatResponse(
                res,
                404,
                "Location not found",
                null,
                "Not found"
            );
        }

        return formatResponse(res, 200, "Location retrieved successfully", location);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// UPDATE LOCATION
const updateLocation = async (req, res) => {
    try {
        const location = await Location.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!location) {
            return formatResponse(
                res,
                404,
                "Location not found",
                null,
                "Not found"
            );
        }

        const { name, locationType } = req.body;

        if (name !== undefined) location.name = name;
        if (locationType !== undefined) location.locationType = locationType;

        await location.save();

        return formatResponse(res, 200, "Location updated successfully", location);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// SOFT DELETE LOCATION
const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!location) {
            return formatResponse(
                res,
                404,
                "Location not found",
                null,
                "Not found"
            );
        }

        location.isDeleted = true;
        location.deletedAt = new Date();

        await location.save();

        return formatResponse(res, 200, "Location deleted successfully", null);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

module.exports = {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
};