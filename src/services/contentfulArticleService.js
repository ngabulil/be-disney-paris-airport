// services/article.service.js
const client = require("../config/contentful")

const getArticles = async ({ page = 1, limit = 6, category }) => {
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

const getRelatedArticles = async (excludeSlug) => {
  const response = await client.getEntries({
    content_type: "article",
    include: 2,
    limit: 10, // ambil beberapa dulu biar bisa random
  })

  // filter yang slug-nya beda
  const filtered = response.items.filter(
    (item) => item.fields.slug !== excludeSlug
  )

  // shuffle (random)
  const shuffled = filtered.sort(() => 0.5 - Math.random())

  // ambil 2
  return shuffled.slice(0, 2)
}

module.exports = {
  getArticles,
  getArticleBySlug,
  getPopularArticles,
  getRelatedArticles,
}