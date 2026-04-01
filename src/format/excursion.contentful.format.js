const formatExcursionTripList = (item) => {
  return {
    id: item.sys.id,
    title: item.fields.title + " Day Trip",
    rawTitle: item.fields.title,
    slug: item.fields.slug,
    heroImage: item.fields.heroImage?.fields?.file?.url || null,
    summary: item.fields.summary
  }
}

const formatExcursionTripDetail = (item) => {
  const allPhotos =
    item.fields.photos?.map((p) => p.fields?.file?.url).filter(Boolean) || []

  const characterImages =
    item.fields.characterImages?.map((p) => p.fields?.file?.url).filter(Boolean) || []

  return {
    id: item.sys.id,
    title: item.fields.title,
    heroTitle: "Private " + item.fields.title + " Day Trip With Driver",
    summaryTitle: "Our Private " + item.fields.title + " Excursion",
    characterTitle: "Why Choose a Private " + item.fields.title + " Excursion?",
    slug: item.fields.slug,
    summary: item.fields.summary,

    heroImage: item.fields.heroImage?.fields?.file?.url || null,

    photos: allPhotos.slice(0, 3),
    photoWhy: allPhotos.slice(3),

    characterTopLeft: characterImages[0] || null,
    characterTopCenter: characterImages[1] || null,
    characterBottomLeft: characterImages[2] || null,
    characterBottomRight: characterImages[3] || null,

    halfDay: item.fields.halfDay,
    fullDay: item.fields.fullDay,
    footerTitle: item.fields.footerTitle,
    footerSummary: item.fields.footerSummary,
  }
}

module.exports = {
  formatExcursionTripList,
  formatExcursionTripDetail,
}