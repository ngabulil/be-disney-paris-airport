const Vehicle = require("../models/vehicle.model");
const { formatResponse } = require("../format/response");

const BOOKING_TYPES = ["economy", "business"];
const VEHICLE_TYPES = ["car", "van"];

// CREATE VEHICLE
const createVehicle = async (req, res) => {
  try {
    const {
      name,
      bookingType,
      vehicleType,
      maxPassenger,
      maxUnit,
      maxStroller,
      photo
    } = req.body;

    if (
      !name ||
      !bookingType ||
      !vehicleType ||
      maxPassenger == null ||
      maxUnit == null ||
      maxStroller == null ||
      !photo
    ) {
      return formatResponse(
        res,
        400,
        "All fields are required",
        null,
        "Validation error"
      );
    }

    if (!BOOKING_TYPES.includes(bookingType)) {
      return formatResponse(
        res,
        400,
        "Invalid bookingType",
        null,
        `Allowed values: ${BOOKING_TYPES.join(", ")}`
      );
    }

    if (!VEHICLE_TYPES.includes(vehicleType)) {
      return formatResponse(
        res,
        400,
        "Invalid vehicleType",
        null,
        `Allowed values: ${VEHICLE_TYPES.join(", ")}`
      );
    }

    const vehicle = await Vehicle.create({
      name,
      bookingType,
      vehicleType,
      maxPassenger,
      maxUnit,
      maxStroller,
      photo
    });

    return formatResponse(res, 201, "Vehicle created successfully", vehicle);
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

// GET ALL VEHICLES
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isDeleted: false });

    return formatResponse(
      res,
      200,
      "Vehicles retrieved successfully",
      vehicles
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

// GET VEHICLE BY ID
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!vehicle) {
      return formatResponse(res, 404, "Vehicle not found", null, "Not found");
    }

    return formatResponse(
      res,
      200,
      "Vehicle retrieved successfully",
      vehicle
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

// UPDATE VEHICLE
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!vehicle) {
      return formatResponse(res, 404, "Vehicle not found", null, "Not found");
    }

    const {
      name,
      bookingType,
      vehicleType,
      maxPassenger,
      maxUnit,
      maxStroller,
      photo
    } = req.body;

    if (bookingType && !BOOKING_TYPES.includes(bookingType)) {
      return formatResponse(
        res,
        400,
        "Invalid bookingType",
        null,
        `Allowed values: ${BOOKING_TYPES.join(", ")}`
      );
    }

    if (vehicleType && !VEHICLE_TYPES.includes(vehicleType)) {
      return formatResponse(
        res,
        400,
        "Invalid vehicleType",
        null,
        `Allowed values: ${VEHICLE_TYPES.join(", ")}`
      );
    }

    if (name !== undefined) vehicle.name = name;
    if (bookingType !== undefined) vehicle.bookingType = bookingType;
    if (vehicleType !== undefined) vehicle.vehicleType = vehicleType;
    if (maxPassenger !== undefined) vehicle.maxPassenger = maxPassenger;
    if (maxUnit !== undefined) vehicle.maxUnit = maxUnit;
    if (maxStroller !== undefined) vehicle.maxStroller = maxStroller;
    if (photo !== undefined) vehicle.photo = photo;

    await vehicle.save();

    return formatResponse(res, 200, "Vehicle updated successfully", vehicle);
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

// DELETE VEHICLE
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!vehicle) {
      return formatResponse(res, 404, "Vehicle not found", null, "Not found");
    }

    vehicle.isDeleted = true;
    vehicle.deletedAt = new Date();

    await vehicle.save();

    return formatResponse(res, 200, "Vehicle deleted successfully", null);
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
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};