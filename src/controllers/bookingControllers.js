const mongoose = require("mongoose");
const { formatResponse } = require("../format/response");
const Booking = require("../models/booking.model");
const Location = require("../models/location.model");
const Hotel = require("../models/hotel.model");
const Terminal = require("../models/terminal.model");
const Vehicle = require("../models/vehicle.model");
const { formatBookingEmailData } = require("../format/bookingFormat");
const { generateAdminBookingPdf } = require("../templates/pdf-template/pdf-admin");
const { generatePdfBuffer } = require("../utils/pdfGenerator");
const { generateCustomerBookingPdf } = require("../templates/pdf-template/pdf-customer");

const ADMIN_EMAILS = process.env.ADMIN_EMAILS.split(",");

const toNumber = (val, def = 0) => {
    if (val === undefined || val === null || val === "") return def;
    const n = Number(val);
    return Number.isNaN(n) ? def : n;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isNightSurcharge = (dateValue) => {
    if (!dateValue) return false;
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return false;

    // assumes server & FE use consistent timezone
    const hour = d.getHours();
    return hour >= 0 && hour < 6; // 00:00 - 05:59
};

const applyPromoDiscount = (total, promo) => {
    if (!promo) return { totalAfterDiscount: total, discountAmount: 0 };

    const discount = Number(promo.discount || 0);
    if (Number.isNaN(discount) || discount <= 0) {
        return { totalAfterDiscount: total, discountAmount: 0 };
    }

    // FLAT discount (not percent)
    const discountAmount = Math.min(discount, total);
    const totalAfterDiscount = Math.max(total - discountAmount, 0);

    return { totalAfterDiscount, discountAmount };
};

const ensureExists = async (Model, id, name) => {
    if (!id) return true; // optional field
    if (!isValidObjectId(id)) return { ok: false, message: `Invalid ${name} id` };

    const doc = await Model.findOne({ _id: id, isDeleted: false }).select("_id");
    if (!doc) return { ok: false, message: `${name} not found` };
    return { ok: true };
};

// CHECK BOOKING PRICE
const checkBookingPrice = async (req, res) => {
    try {
        // FE sends: { clientInput: { ... } }
        const clientInputRaw = req.body?.clientInput || {};

        // normalize inputs (dynamic / partial)
        const passengers = toNumber(clientInputRaw.passengers, null);
        const pickupLocation = clientInputRaw.pickupLocation || null;
        const dropoffLocation = clientInputRaw.dropoffLocation || null;

        const unitCount = toNumber(clientInputRaw.unitCount, 0);
        const strollerCount = toNumber(clientInputRaw.strollerCount, 0);

        const babySeatCount = toNumber(clientInputRaw.babySeatCount, 0);
        const boosterSeatCount = toNumber(clientInputRaw.boosterSeatCount, 0);
        const childSeatCount = toNumber(clientInputRaw.childSeatCount, 0);

        const roundTrip = Boolean(clientInputRaw.roundTrip);

        const pickupDateOut = clientInputRaw.pickupDateOut || null;
        const pickupDateReturn = clientInputRaw.pickupDateReturn || null;

        // selectedCar is the chosen vehicle (step 9)
        const selectedCar = clientInputRaw.selectedCar || clientInputRaw.vehicle || null;

        const promoCodeRaw = (clientInputRaw.promoCode || "").trim();
        const promoCode = promoCodeRaw.length ? promoCodeRaw : null;

        // passengers is required for availability logic
        if (passengers === null || Number.isNaN(passengers) || passengers <= 0) {
            return formatResponse(
                res,
                400,
                "Passengers is required and must be greater than 0",
                {
                    result: {
                        availablePassangers: 0,
                        totalPrice: 0,
                        availableVehicle: [],
                    },
                    clientInput: clientInputRaw,
                },
                "Validation error"
            );
        }

        // validate numeric counts
        const nonNegativeFields = [
            { key: "unitCount", value: unitCount },
            { key: "strollerCount", value: strollerCount },
            { key: "babySeatCount", value: babySeatCount },
            { key: "boosterSeatCount", value: boosterSeatCount },
            { key: "childSeatCount", value: childSeatCount },
        ];
        for (const f of nonNegativeFields) {
            if (f.value < 0) {
                return formatResponse(
                    res,
                    400,
                    `${f.key} must be a non-negative number`,
                    null,
                    "Validation error"
                );
            }
        }

        // validate ids if provided
        if (pickupLocation && !isValidObjectId(pickupLocation)) {
            return formatResponse(res, 400, "Invalid pickupLocation id", null, "Validation error");
        }
        if (dropoffLocation && !isValidObjectId(dropoffLocation)) {
            return formatResponse(res, 400, "Invalid dropoffLocation id", null, "Validation error");
        }
        if (selectedCar && !isValidObjectId(selectedCar)) {
            return formatResponse(res, 400, "Invalid selectedCar id", null, "Validation error");
        }

        // pickup and dropoff cannot be same (only if both exist)
        if (pickupLocation && dropoffLocation && pickupLocation === dropoffLocation) {
            return formatResponse(
                res,
                400,
                "Pickup and dropoff locations cannot be the same",
                null,
                "Invalid request"
            );
        }

        // seats consume capacity (assumption):
        // requiredCapacity = passengers + (baby+booster+child seat count)
        const requiredPassengerCapacity =
            passengers + babySeatCount + boosterSeatCount + childSeatCount;

        // 1) Base available vehicles (filter by capacity/unit/stroller first)
        let vehicles = await Vehicle.find({ isDeleted: false }).select(
            "_id name bookingType vehicleType maxPassenger maxUnit maxStroller"
        );

        vehicles = vehicles.filter((v) => {
            if (requiredPassengerCapacity > v.maxPassenger) return false;
            if (unitCount > 0 && unitCount > v.maxUnit) return false;
            if (strollerCount > 0 && strollerCount > v.maxStroller) return false;
            return true;
        });

        // 2) If pickup+dropoff exist, restrict to vehicles that have pricing for the trip
        let tripDoc = null;
        let pricingListForTrip = null;

        if (pickupLocation && dropoffLocation) {
            tripDoc = await Trip.findOne({
                pickupLocation,
                dropoffLocation,
                isDeleted: false,
            });

            if (!tripDoc) {
                return formatResponse(
                    res,
                    404,
                    "Trip not found for selected pickup and dropoff locations",
                    {
                        result: {
                            availablePassangers: requiredPassengerCapacity,
                            totalPrice: 0,
                            availableVehicle: [],
                        },
                        clientInput: {
                            passengers,
                            pickupLocation,
                            dropoffLocation,
                            unitCount,
                            roundTrip,
                            strollerCount,
                            babySeatCount,
                            boosterSeatCount,
                            childSeatCount,
                            pickupDateOut,
                            pickupDateReturn,
                            selectedCar,
                            promoCode,
                        },
                    },
                    "Trip not available"
                );
            }

            pricingListForTrip = await PricingVehicle.find({
                trip: tripDoc._id,
                isDeleted: false,
            }).select("vehicle price");

            const allowedVehicleIds = new Set(pricingListForTrip.map((p) => String(p.vehicle)));

            vehicles = vehicles.filter((v) => allowedVehicleIds.has(String(v._id)));
        }

        // 3) total price (only if trip + selectedCar exists)
        let totalPrice = 0;

        if (tripDoc && selectedCar) {
            // validate selected vehicle exists & not deleted
            const selectedVehicleDoc = await Vehicle.findOne({
                _id: selectedCar,
                isDeleted: false,
            });

            if (!selectedVehicleDoc) {
                return formatResponse(
                    res,
                    404,
                    "Selected vehicle not found",
                    null,
                    "Invalid vehicle reference"
                );
            }

            // also validate selected vehicle still meets constraints (passenger/unit/stroller)
            const meetsCapacity = requiredPassengerCapacity <= selectedVehicleDoc.maxPassenger;
            const meetsUnit = unitCount <= selectedVehicleDoc.maxUnit;
            const meetsStroller = strollerCount <= selectedVehicleDoc.maxStroller;

            if (!meetsCapacity || !meetsUnit || !meetsStroller) {
                return formatResponse(
                    res,
                    400,
                    "Selected vehicle does not match your booking requirements",
                    null,
                    "Vehicle not available"
                );
            }

            // find pricing (use cached list if available)
            let pricing = null;
            if (pricingListForTrip) {
                pricing = pricingListForTrip.find((p) => String(p.vehicle) === String(selectedCar)) || null;
            } else {
                pricing = await PricingVehicle.findOne({
                    trip: tripDoc._id,
                    vehicle: selectedCar,
                    isDeleted: false,
                });
            }

            if (!pricing) {
                return formatResponse(
                    res,
                    404,
                    "Pricing not found for this trip and vehicle",
                    null,
                    "Pricing not available"
                );
            }

            const basePrice = Number(pricing.price);

            const NIGHT_SURCHARGE_FLAT = 25;

            // base total
            totalPrice = roundTrip ? basePrice * 2 : basePrice;

            // night surcharge (+25 flat per leg)
            if (isNightSurcharge(pickupDateOut)) totalPrice += NIGHT_SURCHARGE_FLAT;
            if (roundTrip && isNightSurcharge(pickupDateReturn)) totalPrice += NIGHT_SURCHARGE_FLAT;

            // promo code
            if (promoCode) {
                const promo = await Promo.findOne({
                    promoCode,
                    isDeleted: false,
                    isValid: true,
                });

                if (!promo) {
                    return formatResponse(
                        res,
                        400,
                        "Invalid promo code",
                        {
                            result: {
                                availablePassangers: requiredPassengerCapacity,
                                totalPrice,
                                availableVehicle: vehicles,
                            },
                            clientInput: {
                                passengers,
                                pickupLocation,
                                dropoffLocation,
                                unitCount,
                                roundTrip,
                                strollerCount,
                                babySeatCount,
                                boosterSeatCount,
                                childSeatCount,
                                pickupDateOut,
                                pickupDateReturn,
                                selectedCar,
                                promoCode,
                            },
                        },
                        "Promo not found"
                    );
                }

                // validate promo rules (optional constraints)
                if (promo.allowedTripId && String(promo.allowedTripId) !== String(tripDoc._id)) {
                    return formatResponse(res, 400, "Promo code is not valid for this trip", null, "Promo rule");
                }
                if (promo.allowedBookingType && promo.allowedBookingType !== selectedVehicleDoc.bookingType) {
                    return formatResponse(
                        res,
                        400,
                        "Promo code is not valid for this booking type",
                        null,
                        "Promo rule"
                    );
                }
                if (promo.roundtrip !== undefined && promo.roundtrip !== null) {
                    if (Boolean(promo.roundtrip) !== Boolean(roundTrip)) {
                        return formatResponse(
                            res,
                            400,
                            "Promo code is not valid for this trip type",
                            null,
                            "Promo rule"
                        );
                    }
                }

                const { totalAfterDiscount } = applyPromoDiscount(totalPrice, promo);
                totalPrice = totalAfterDiscount;
            }
        }

        // final response shape (data contains your structure)
        return formatResponse(res, 200, "Booking calculation retrieved successfully", {
            result: {
                availablePassangers: requiredPassengerCapacity,
                totalPrice,
                availableVehicle: vehicles,
            },
            clientInput: {
                passengers,
                pickupLocation,
                dropoffLocation,
                unitCount,
                roundTrip,
                strollerCount,
                babySeatCount,
                boosterSeatCount,
                childSeatCount,
                pickupDateOut,
                pickupDateReturn,
                selectedCar,
                promoCode,
            },
        });
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const payload = req.body || {};

        const requiredFields = [
            "fullName",
            "email",
            "phoneNumber",
            "pickupLocation",
            "dropoffLocation",
            "vehicleId",
            "roundtrip",
            "passengers",
            "suitcases",
            "handLuggage",
            "strollers",
            "babySeats",
            "boosterSeats",
            "childSeats",
            "pickupDateOut",
            "paymentMethod",
        ];

        for (const f of requiredFields) {
            if (payload[f] === undefined || payload[f] === null || payload[f] === "") {
                return formatResponse(res, 400, `${f} is required`, null, "Validation error");
            }
        }

        if (payload.pickupLocation === payload.dropoffLocation) {
            return formatResponse(
                res,
                400,
                "Pickup and dropoff locations cannot be the same",
                null,
                "Validation error"
            );
        }

        // ✅ VALIDATE REFERENCES
        const checks = [
            await ensureExists(Location, payload.pickupLocation, "Pickup location"),
            await ensureExists(Location, payload.dropoffLocation, "Dropoff location"),
            await ensureExists(Vehicle, payload.vehicleId, "Vehicle"),
            await ensureExists(Hotel, payload.pickupHotel, "Pickup hotel"),
            await ensureExists(Hotel, payload.dropoffHotel, "Dropoff hotel"),
            await ensureExists(Terminal, payload.pickupTerminal, "Pickup terminal"),
            await ensureExists(Terminal, payload.dropoffTerminal, "Dropoff terminal"),
        ];

        const failed = checks.find((c) => c !== true && c.ok === false);
        if (failed) {
            return formatResponse(res, 400, failed.message, null, "Invalid reference");
        }

        // ✅ VALIDASI ROUNDTRIP
        if (Boolean(payload.roundtrip) === true && !payload.pickupDateReturn) {
            return formatResponse(
                res,
                400,
                "pickupDateReturn is required for roundtrip bookings",
                null,
                "Validation error"
            );
        }

        // =========================
        // 🔥 HITUNG HARGA DI BACKEND
        // =========================

        const fakeReq = {
            body: {
                clientInput: {
                    passengers: payload.passengers,
                    pickupLocation: payload.pickupLocation,
                    dropoffLocation: payload.dropoffLocation,
                    selectedCar: payload.vehicleId,
                    roundTrip: payload.roundtrip,
                    pickupDateOut: payload.pickupDateOut,
                    pickupDateReturn: payload.pickupDateReturn,
                    strollerCount: payload.strollers,
                    babySeatCount: payload.babySeats,
                    boosterSeatCount: payload.boosterSeats,
                    childSeatCount: payload.childSeats,
                },
            },
        };

        // panggil logic yang sama
        let calculatedPrice = 0;

        const priceResult = await (async () => {
            try {
                // ambil langsung dari logic (refactor kalau mau lebih clean)
                const result = await checkBookingPriceInternal(fakeReq.body.clientInput);
                return result;
            } catch {
                return null;
            }
        })();

        if (!priceResult) {
            return formatResponse(res, 400, "Failed to calculate booking price", null);
        }

        calculatedPrice = priceResult.totalPrice;

        // =========================
        // ✅ CREATE BOOKING (SAFE)
        // =========================

        const booking = await Booking.create({
            ...payload,
            totalPrice: calculatedPrice, // ✅ dari backend
            statusPayment: false, // ❌ FE tidak boleh set ini
            statusTrip: "pending",
            isDeleted: false,
            deletedAt: null,
        });

        // =========================
        // ✅ SEND EMAIL (SAFE)
        // =========================
        const populatedBooking = await Booking.findById(booking._id)
            .populate("pickupLocation", "name locationType")
            .populate("dropoffLocation", "name locationType")
            .populate("pickupHotel", "name")
            .populate("dropoffHotel", "name")
            .populate("pickupTerminal", "name location")
            .populate("dropoffTerminal", "name location")
            .populate("vehicleId", "name bookingType vehicleType maxPassenger maxUnit maxStroller");

        const data = formatBookingEmailData(populatedBooking)

        // HTML
        const adminHtml = generateAdminBookingEmail(data)
        const customerHtml = generateBookingEmailCustomer(data)

        // PDF
        const adminPdf = await generatePdfBuffer(generateAdminBookingPdf(data))
        const customerPdf = await generatePdfBuffer(generateCustomerBookingPdf(data))

        // SEND ADMIN
        await sendEmailWithPdf({
            to: ADMIN_EMAILS,
            subject: "New Booking Received",
            html: adminHtml,
            pdfBuffer: adminPdf,
            filename: `booking-admin-${booking._id}.pdf`,
        })

        // SEND CUSTOMER
        await sendEmailWithPdf({
            to: booking.email,
            subject: "Your Booking Confirmation",
            html: customerHtml,
            pdfBuffer: customerPdf,
            filename: `booking-${booking._id}.pdf`,
        })

        return formatResponse(res, 201, "Booking created successfully", booking);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .populate("pickupLocation", "name locationType")
            .populate("dropoffLocation", "name locationType")
            .populate("pickupHotel", "name")
            .populate("dropoffHotel", "name")
            .populate("pickupTerminal", "name location")
            .populate("dropoffTerminal", "name location")
            .populate("vehicleId", "name bookingType vehicleType maxPassenger maxUnit maxStroller");

        return formatResponse(res, 200, "Bookings retrieved successfully", bookings);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// GET BOOKING BY ID
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return formatResponse(res, 400, "Invalid booking id", null, "Validation error");
        }

        const booking = await Booking.findOne({ _id: id, isDeleted: false })
            .populate("pickupLocation", "name locationType")
            .populate("dropoffLocation", "name locationType")
            .populate("pickupHotel", "name")
            .populate("dropoffHotel", "name")
            .populate("pickupTerminal", "name location")
            .populate("dropoffTerminal", "name location")
            .populate("vehicleId", "name bookingType vehicleType maxPassenger maxUnit maxStroller");

        if (!booking) {
            return formatResponse(res, 404, "Booking not found", null, "Not found");
        }

        return formatResponse(res, 200, "Booking retrieved successfully", booking);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// UPDATE BOOKING
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusTrip } = req.body;

        if (!isValidObjectId(id)) {
            return formatResponse(res, 400, "Invalid booking id", null, "Validation error");
        }

        const booking = await Booking.findOne({ _id: id, isDeleted: false });
        if (!booking) {
            return formatResponse(res, 404, "Booking not found", null, "Not found");
        }

        // ❌ wajib kirim statusTrip
        if (!statusTrip) {
            return formatResponse(
                res,
                400,
                "statusTrip is required",
                null,
                "Validation error"
            );
        }

        const allowedStatusTrip = ["pending", "confirmed", "cancelled", "completed"];

        if (!allowedStatusTrip.includes(statusTrip)) {
            return formatResponse(
                res,
                400,
                "Invalid statusTrip value",
                null,
                "Validation error"
            );
        }

        // ✅ set statusTrip
        booking.statusTrip = statusTrip;

        // ✅ auto control statusPayment
        if (statusTrip === "completed") {
            booking.statusPayment = true;
        } else {
            booking.statusPayment = false;
        }

        await booking.save();

        // ✅ send email
        const populatedBooking = await Booking.findById(booking._id)
            .populate("pickupLocation", "name locationType")
            .populate("dropoffLocation", "name locationType")
            .populate("pickupHotel", "name")
            .populate("dropoffHotel", "name")
            .populate("pickupTerminal", "name location")
            .populate("dropoffTerminal", "name location")
            .populate("vehicleId", "name bookingType vehicleType maxPassenger maxUnit maxStroller");

        const data = formatBookingEmailData(populatedBooking)

        // generate ulang email + pdf
        const adminHtml = generateAdminBookingEmail(data)
        const customerHtml = generateBookingEmailCustomer(data)

        const adminPdf = await generatePdfBuffer(generateAdminBookingPdf(data))
        const customerPdf = await generatePdfBuffer(generateCustomerBookingPdf(data))

        await sendEmailWithPdf({
            to: ADMIN_EMAILS,
            subject: "Booking Updated",
            html: adminHtml,
            pdfBuffer: adminPdf,
            filename: `booking-admin-${booking._id}.pdf`,
        })

        await sendEmailWithPdf({
            to: booking.email,
            subject: "Your Booking Status Updated",
            html: customerHtml,
            pdfBuffer: customerPdf,
            filename: `booking-${booking._id}.pdf`,
        })

        return formatResponse(res, 200, "Booking updated successfully", {
            id: booking._id,
            statusTrip: booking.statusTrip,
            statusPayment: booking.statusPayment,
        });

    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// DELETE BOOKING
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return formatResponse(res, 400, "Invalid booking id", null, "Validation error");
        }

        const booking = await Booking.findOne({ _id: id, isDeleted: false });
        if (!booking) {
            return formatResponse(res, 404, "Booking not found", null, "Not found");
        }

        booking.isDeleted = true;
        booking.deletedAt = new Date();

        await booking.save();

        return formatResponse(res, 200, "Booking deleted successfully", null);
    } catch (error) {
        return formatResponse(res, 500, "Internal server error", null, error.message);
    }
};

// ADMIN PDF DOWNLOAD
const downloadAdminBookingPdf = async (req, res) => {
    try {
        const { id } = req.params

        const booking = await Booking.findById(id)
            .populate("pickupLocation", "name locationType")
            .populate("dropoffLocation", "name locationType")
            .populate("pickupHotel", "name")
            .populate("dropoffHotel", "name")
            .populate("pickupTerminal", "name location")
            .populate("dropoffTerminal", "name location")
            .populate("vehicleId", "name bookingType vehicleType maxPassenger maxUnit maxStroller");

        if (!booking) {
            return formatResponse(res, 404, "Booking not found")
        }

        const data = formatBookingEmailData(booking)
        const html = generateAdminBookingPdf(data)
        const pdfBuffer = await generatePdfBuffer(html)

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=booking-admin-${id}.pdf`,
        })

        return res.send(pdfBuffer)
    } catch (error) {
        return formatResponse(res, 500, "Failed generate pdf", null, error.message)
    }
}

// CUSTOMER PDF DOWNLOAD
const downloadCustomerBookingPdf = async (req, res) => {
    try {
        const { id } = req.params

        const booking = await Booking.findById(id)
            .populate("pickupLocation", "name locationType")
            .populate("dropoffLocation", "name locationType")
            .populate("pickupHotel", "name")
            .populate("dropoffHotel", "name")
            .populate("pickupTerminal", "name location")
            .populate("dropoffTerminal", "name location")
            .populate("vehicleId", "name bookingType vehicleType maxPassenger maxUnit maxStroller");

        if (!booking) {
            return formatResponse(res, 404, "Booking not found")
        }

        const data = formatBookingEmailData(booking)
        const html = generateCustomerBookingPdf(data)
        const pdfBuffer = await generatePdfBuffer(html)

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=booking-customer-${id}.pdf`,
        })

        return res.send(pdfBuffer)
    } catch (error) {
        return formatResponse(res, 500, "Failed generate pdf", null, error.message)
    }
}

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    checkBookingPrice,
    downloadAdminBookingPdf,
    downloadCustomerBookingPdf
};