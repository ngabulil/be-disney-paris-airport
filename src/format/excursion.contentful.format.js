const formatExcursionTripList = (item) => {
  return {
    id: item.sys.id,
    title: item.fields.title,
    slug: item.fields.slug,
    heroImage: item.fields.heroImage?.fields?.file?.url || null,
    summary: item.fields.summary
  }
}

const formatExcursionTripDetail = (item) => {
  return {
    id: item.sys.id,
    title: item.fields.title,
    slug: item.fields.slug,
    summary: item.fields.summary,
    heroImage: item.fields.heroImage?.fields?.file?.url || null,
    photos: item.fields.photos?.map(
      (p) => p.fields?.file?.url
    ) || [],
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