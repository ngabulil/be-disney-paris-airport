const express = require("express");
const router = express.Router();

const { updateWaKey } = require("../controllers/waControllers");

router.get("/update-key", updateWaKey);

module.exports = router;