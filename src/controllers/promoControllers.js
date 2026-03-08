const Promo = require("../models/promo.model");
const Trip = require("../models/trip.model");
const { formatResponse } = require("../format/response");

// CREATE PROMO
const createPromo = async (req, res) => {
    try {
        const {
            discount,
            promoCode,
            allowedTripId,
            allowedBookingType,
            roundtrip,
            isValid
        } = req.body;

        if (discount == null || !promoCode || isValid == null) {
            return formatResponse(
                res,
                400,
                "Discount, promoCode, and isValid are required",
                null,
                "Validation error"
            );
        }

        if (Number(discount) <= 0) {
            return formatResponse(
                res,
                400,
                "Discount must be greater than 0",
                null,
                "Invalid discount"
            );
        }

        // Check promo code duplicate
        const existingPromo = await Promo.findOne({
            promoCode,
            isDeleted: false
        });

        if (existingPromo) {
            return formatResponse(
                res,
                400,
                "Promo code already exists",
                null,
                "Duplicate promo code"
            );
        }

        // Validate trip if provided
        if (allowedTripId) {
            const trip = await Trip.findOne({
                _id: allowedTripId,
                isDeleted: false
            });

            if (!trip) {
                return formatResponse(
                    res,
                    404,
                    "Trip not found",
                    null,
                    "Invalid allowedTripId"
                );
            }
        }

        const promo = await Promo.create({
            discount,
            promoCode,
            allowedTripId: allowedTripId || null,
            allowedBookingType: allowedBookingType || null,
            roundtrip: roundtrip ?? null,
            isValid
        });

        return formatResponse(res, 201, "Promo created successfully", promo);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET ALL PROMOS
const getAllPromos = async (req, res) => {
    try {
        const promos = await Promo.find({ isDeleted: false })
            .populate("allowedTripId");

        return formatResponse(res, 200, "Promos retrieved successfully", promos);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET PROMO BY ID
const getPromoById = async (req, res) => {
    try {
        const promo = await Promo.findOne({
            _id: req.params.id,
            isDeleted: false
        }).populate("allowedTripId");

        if (!promo) {
            return formatResponse(
                res,
                404,
                "Promo not found",
                null,
                "Not found"
            );
        }

        return formatResponse(res, 200, "Promo retrieved successfully", promo);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// UPDATE PROMO
const updatePromo = async (req, res) => {
    try {
        const promo = await Promo.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!promo) {
            return formatResponse(
                res,
                404,
                "Promo not found",
                null,
                "Not found"
            );
        }

        const {
            discount,
            promoCode,
            allowedTripId,
            allowedBookingType,
            roundtrip,
            isValid
        } = req.body;

        // Validate discount if provided
        if (discount !== undefined) {
            if (Number(discount) <= 0) {
                return formatResponse(
                    res,
                    400,
                    "Discount must be greater than 0",
                    null,
                    "Invalid discount"
                );
            }
            promo.discount = discount;
        }

        // Validate promoCode if provided
        if (promoCode !== undefined) {
            const existingPromo = await Promo.findOne({
                promoCode,
                isDeleted: false,
                _id: { $ne: promo._id }
            });

            if (existingPromo) {
                return formatResponse(
                    res,
                    400,
                    "Promo code already exists",
                    null,
                    "Duplicate promo code"
                );
            }

            promo.promoCode = promoCode;
        }

        // Validate allowedTripId if provided
        if (allowedTripId !== undefined) {
            if (allowedTripId) {
                const trip = await Trip.findOne({
                    _id: allowedTripId,
                    isDeleted: false
                });

                if (!trip) {
                    return formatResponse(
                        res,
                        404,
                        "Trip not found",
                        null,
                        "Invalid allowedTripId"
                    );
                }

                promo.allowedTripId = allowedTripId;
            } else {
                promo.allowedTripId = null;
            }
        }

        if (allowedBookingType !== undefined) promo.allowedBookingType = allowedBookingType;
        if (roundtrip !== undefined) promo.roundtrip = roundtrip;
        if (isValid !== undefined) promo.isValid = isValid;

        await promo.save();

        return formatResponse(res, 200, "Promo updated successfully", promo);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// SOFT DELETE PROMO
const deletePromo = async (req, res) => {
    try {
        const promo = await Promo.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!promo) {
            return formatResponse(
                res,
                404,
                "Promo not found",
                null,
                "Not found"
            );
        }

        promo.isDeleted = true;
        promo.deletedAt = new Date();

        await promo.save();

        return formatResponse(res, 200, "Promo deleted successfully", null);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

module.exports = {
    createPromo,
    getAllPromos,
    getPromoById,
    updatePromo,
    deletePromo
};