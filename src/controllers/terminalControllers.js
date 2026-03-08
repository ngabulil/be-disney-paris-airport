const Terminal = require("../models/terminal.model");
const Location = require("../models/location.model");
const { formatResponse } = require("../format/response");

// CREATE TERMINAL
const createTerminal = async (req, res) => {
    try {
        const { location, name } = req.body;

        if (!location || !name) {
            return formatResponse(
                res,
                400,
                "Location and terminal name are required",
                null,
                "Validation error"
            );
        }

        // validate location exists
        const existingLocation = await Location.findOne({
            _id: location,
            isDeleted: false,
        });

        if (!existingLocation) {
            return formatResponse(
                res,
                404,
                "Location not found",
                null,
                "Invalid location reference"
            );
        }

        const terminal = await Terminal.create({
            location,
            name,
        });

        return formatResponse(res, 201, "Terminal created successfully", terminal);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET ALL TERMINALS
const getAllTerminals = async (req, res) => {
    try {
        const terminals = await Terminal.find({ isDeleted: false })
            .populate("location", "name locationType");

        return formatResponse(
            res,
            200,
            "Terminals retrieved successfully",
            terminals
        );
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET TERMINAL BY ID
const getTerminalById = async (req, res) => {
    try {
        const terminal = await Terminal.findOne({
            _id: req.params.id,
            isDeleted: false,
        }).populate("location", "name locationType");

        if (!terminal) {
            return formatResponse(
                res,
                404,
                "Terminal not found",
                null,
                "Not found"
            );
        }

        return formatResponse(
            res,
            200,
            "Terminal retrieved successfully",
            terminal
        );
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// UPDATE TERMINAL
const updateTerminal = async (req, res) => {
    try {
        const terminal = await Terminal.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!terminal) {
            return formatResponse(
                res,
                404,
                "Terminal not found",
                null,
                "Not found"
            );
        }

        const { location, name } = req.body;

        if (location) {
            const existingLocation = await Location.findOne({
                _id: location,
                isDeleted: false,
            });

            if (!existingLocation) {
                return formatResponse(
                    res,
                    404,
                    "Location not found",
                    null,
                    "Invalid location reference"
                );
            }

            terminal.location = location;
        }

        if (name !== undefined) terminal.name = name;

        await terminal.save();

        return formatResponse(
            res,
            200,
            "Terminal updated successfully",
            terminal
        );
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// SOFT DELETE TERMINAL
const deleteTerminal = async (req, res) => {
    try {
        const terminal = await Terminal.findOne({
            _id: req.params.id,
            isDeleted: false,
        });

        if (!terminal) {
            return formatResponse(
                res,
                404,
                "Terminal not found",
                null,
                "Not found"
            );
        }

        terminal.isDeleted = true;
        terminal.deletedAt = new Date();

        await terminal.save();

        return formatResponse(
            res,
            200,
            "Terminal deleted successfully",
            null
        );
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

module.exports = {
    createTerminal,
    getAllTerminals,
    getTerminalById,
    updateTerminal,
    deleteTerminal,
};