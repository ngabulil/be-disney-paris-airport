const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const { formatResponse } = require("../format/response");

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return formatResponse(
                res,
                401,
                "Token not found",
                null,
                "Unauthorized"
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return formatResponse(
                res,
                401,
                "Token not valid",
                null,
                "Unauthorized"
            );
        }

        req.admin = admin;
        next();
    } catch (error) {
        return formatResponse(
            res,
            401,
            "Token not valid",
            null,
            error.message
        );
    }
};

module.exports = authMiddleware;