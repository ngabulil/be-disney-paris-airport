const articleService = require("../services/contentfulArticleService")
const formatter = require("../format/article.contentful.format")
const { formatResponse } = require("../format/response") // sesuaikan path

/**
 * =========================
 * GET ARTICLES (Pagination)
 * =========================
 */
const getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 6
    const category = req.query.category || null

    const { total, items } = await articleService.getArticles({
      page,
      limit,
      category,
    })

    const formatted = items.map(formatter.formatArticleList)

    return formatResponse(res, 200, "Articles fetched successfully", {
      total,
      page,
      limit,
      category,
      data: formatted,
    })
  } catch (error) {
    return formatResponse(
      res,
      500,
      "Failed to fetch articles",
      null,
      error.message
    )
  }
}

/**
 * =========================
 * GET ARTICLE DETAIL
 * =========================
 */
const getArticleDetail = async (req, res) => {
  try {
    const { slug } = req.params

    const article = await articleService.getArticleBySlug(slug)

    if (!article) {
      return formatResponse(res, 404, "Article not found", null, "Not Found")
    }

    const related = await articleService.getRelatedArticles(slug)

    const formatted = formatter.formatArticleDetail(article)

    const formattedRelated = related.map((item) =>
      formatter.formatArticleList(item) // atau pakai formatter lain
    )

    return formatResponse(
      res,
      200,
      "Article detail fetched successfully",
      {
        ...formatted,
        relatedArticles: formattedRelated,
      }
    )
  } catch (error) {
    return formatResponse(
      res,
      500,
      "Failed to fetch article detail",
      null,
      error.message
    )
  }
}

/**
 * =========================
 * GET POPULAR ARTICLES
 * =========================
 */
const getPopularArticles = async (req, res) => {
  try {
    const articles = await articleService.getPopularArticles()

    const formatted = formatter.formatPopularArticles(articles)

    return formatResponse(
      res,
      200,
      "Popular articles fetched successfully",
      formatted
    )
  } catch (error) {
    return formatResponse(
      res,
      500,
      "Failed to fetch popular articles",
      null,
      error.message
    )
  }
}

module.exports = {
  getArticles,
  getArticleDetail,
  getPopularArticles,
}