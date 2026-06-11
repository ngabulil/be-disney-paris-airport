const Wa = require("../models/wa.model");
const { formatResponse } = require("../format/response");

const updateWaKey = async (req, res) => {
    try {
        const { keyBusiness, keyPersonal } = req.query;

        if (!keyBusiness || !keyPersonal) {
            return formatResponse(
                res,
                400,
                "keyBusiness and keyPersonal required",
                null,
                "Validation error"
            );
        }

        const wa = await Wa.findOneAndUpdate(
            {}, // cari data WA yang sudah ada
            {
                keyNumberBusiness: keyBusiness,
                keyNumberPersonal: keyPersonal,
            },
            {
                new: true,          // return data terbaru
                upsert: true,       // kalau belum ada, create baru
                runValidators: true // validasi schema tetap jalan
            }
        );

        return formatResponse(res, 200, "WA key updated successfully", {
            id: wa._id,
            keyNumberBusiness: wa.keyNumberBusiness,
            keyNumberPersonal: wa.keyNumberPersonal,
        });
    } catch (error) {
        return formatResponse(res, 500, "Server error", null, error.message);
    }
};

module.exports = {
    updateWaKey,
};