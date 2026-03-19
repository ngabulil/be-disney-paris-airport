const client = require("../config/contentful")

const getExcursionTrips = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit

  const query = {
    content_type: "excursionTrip", // pastikan ini sesuai di Contentful
    order: "-sys.createdAt",
    skip,
    limit,
  }

  const response = await client.getEntries(query)

  return {
    total: response.total,
    items: response.items,
  }
}

const getExcursionTripBySlug = async (slug) => {
  const response = await client.getEntries({
    content_type: "excursionTrip",
    "fields.slug": slug,
    include: 3,
    limit: 1,
  })

  return response.items[0] || null
}

module.exports = {
  getExcursionTrips,
  getExcursionTripBySlug,
}