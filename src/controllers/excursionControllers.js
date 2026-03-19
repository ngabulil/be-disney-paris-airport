const excursionTripService = require("../services/contentfulExcursionService")
const formatter = require("../format/excursion.contentful.format") // bikin file ini
const { formatResponse } = require("../format/response")

/**
 * =========================
 * GET EXCURSION TRIPS (Pagination)
 * =========================
 */
const getExcursionTrips = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 9

    const { total, items } = await excursionTripService.getExcursionTrips({
      page,
      limit,
    })

    const formatted = items.map(formatter.formatExcursionTripList)

    return formatResponse(res, 200, "Excursion trips fetched successfully", {
      total,
      page,
      limit,
      data: formatted,
    })
  } catch (error) {
    return formatResponse(
      res,
      500,
      "Failed to fetch excursion trips",
      null,
      error.message
    )
  }
}

/**
 * =========================
 * GET EXCURSION TRIP DETAIL
 * =========================
 */
const getExcursionTripDetail = async (req, res) => {
  try {
    const { slug } = req.params

    const trip = await excursionTripService.getExcursionTripBySlug(slug)

    if (!trip) {
      return formatResponse(res, 404, "Excursion trip not found", null, "Not Found")
    }

    const formatted = formatter.formatExcursionTripDetail(trip)

    return formatResponse(
      res,
      200,
      "Excursion trip detail fetched successfully",
      formatted
    )
  } catch (error) {
    return formatResponse(
      res,
      500,
      "Failed to fetch excursion trip detail",
      null,
      error.message
    )
  }
}

module.exports = {
  getExcursionTrips,
  getExcursionTripDetail,
}