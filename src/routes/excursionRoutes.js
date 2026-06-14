const express = require("express")
const router = express.Router()
const controller = require("../controllers/excursionControllers")

router.get("/", controller.getExcursionTrips)
router.get("/:slug", controller.getExcursionTripDetail)

module.exports = router