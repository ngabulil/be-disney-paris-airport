// services/article.service.js
const client = require("../config/contentful")

const getArticles = async ({ page = 1, limit = 10, category }) => {
  const skip = (page - 1) * limit

  const query = {
    content_type: "article",
    order: "-sys.createdAt",
    skip,
    limit,
  }

  if (category) {
    query["fields.category"] = category
  }

  const response = await client.getEntries(query)

  return {
    total: response.total,
    items: response.items,
  }
}

const getArticleBySlug = async (slug) => {
  const response = await client.getEntries({
    content_type: "article",
    "fields.slug": slug,
    include: 3,
    limit: 1,
  })

  return response.items[0] || null
}

const getPopularArticles = async () => {
  const response = await client.getEntries({
    content_type: "articlePage",
    include: 2,
    limit: 1,
  })

  if (!response.items.length) return []

  return response.items[0].fields.popularArticle || []
}

module.exports = {
  getArticles,
  getArticleBySlug,
  getPopularArticles,
}