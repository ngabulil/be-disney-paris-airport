const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { formatResponse } = require("../format/response");

// REGISTER ADMIN
const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return formatResponse(
                res,
                400,
                "Username and password required",
                null,
                "Validation error"
            );
        }

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return formatResponse(
                res,
                400,
                "Username already exists",
                null,
                "Username already exists"
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            username,
            password: hashedPassword,
        });

        return formatResponse(res, 201, "Register success", {
            id: admin._id,
            username: admin.username,
        });
    } catch (error) {
        return formatResponse(res, 500, "Server error", null, error.message);
    }
};

// LOGIN ADMIN
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return formatResponse(
                res,
                400,
                "Username and password required",
                null,
                "Validation error"
            );
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return formatResponse(
                res,
                400,
                "Username or password wrong",
                null,
                "Invalid credentials"
            );
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return formatResponse(
                res,
                400,
                "Username or password wrong",
                null,
                "Invalid credentials"
            );
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return formatResponse(res, 200, "Login success", {
            token,
            admin: {
                id: admin._id,
                username: admin.username,
            },
        });
    } catch (error) {
        return formatResponse(res, 500, "Server error", null, error.message);
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
};