const Hotel = require("../models/hotel.model");
const { formatResponse } = require("../format/response");

// CREATE HOTEL
const createHotel = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return formatResponse(
                res,
                400,
                "Hotel name is required",
                null,
                "Validation error"
            );
        }

        const hotel = await Hotel.create({ name });

        return formatResponse(res, 201, "Hotel created successfully", hotel);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET ALL HOTELS (not deleted)
const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ isDeleted: false });

        return formatResponse(res, 200, "Hotels retrieved successfully", hotels);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET HOTEL BY ID
const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!hotel) {
            return formatResponse(
                res,
                404,
                "Hotel not found",
                null,
                "Not found"
            );
        }

        return formatResponse(res, 200, "Hotel retrieved successfully", hotel);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// UPDATE HOTEL
const updateHotel = async (req, res) => {
    try {
        const { name } = req.body;

        const hotel = await Hotel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!hotel) {
            return formatResponse(
                res,
                404,
                "Hotel not found",
                null,
                "Not found"
            );
        }

        if (name) hotel.name = name;

        await hotel.save();

        return formatResponse(res, 200, "Hotel updated successfully", hotel);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// SOFT DELETE HOTEL
const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!hotel) {
            return formatResponse(
                res,
                404,
                "Hotel not found",
                null,
                "Not found"
            );
        }

        hotel.isDeleted = true;
        hotel.deletedAt = new Date();

        await hotel.save();

        return formatResponse(res, 200, "Hotel deleted successfully", null);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

module.exports = {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
};