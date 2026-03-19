// helper ambil image url
const getImageUrl = (media) => {
  if (!media?.fields?.file?.url) return null
  return `https:${media.fields.file.url}`
}

/**
 * =========================
 * LIST ARTICLE (Pagination)
 * =========================
 */
const formatArticleList = (article) => ({
  id: article.sys.id,
  title: article.fields.title,
  slug: article.fields.slug,
  category: article.fields.category || null,
  readDuration: article.fields.readDuration || 0,
  description: article.fields.description || null,
  heroImage: getImageUrl(article.fields.heroImage),
  createdAt: article.sys.createdAt,
})

/**
 * =========================
 * POPULAR ARTICLE
 * =========================
 */
const formatPopularArticles = (articles) =>
  articles.map((article) => ({
    id: article.sys.id,
    title: article.fields.title,
    slug: article.fields.slug,
    heroImage: getImageUrl(article.fields.heroImage),
    readDuration: article.fields.readDuration || 0,
    description: article.fields.description || null,
  }))

/**
 * =========================
 * DETAIL ARTICLE
 * =========================
 */

const formatSections = (sections = []) => {
  return sections.map((section) => {
    const type = section.sys.contentType.sys.id

    if (type === "singleColumnSection") {
      return {
        type: "single",
        blocks: formatBlocks(section.fields.blocks),
      }
    }

    if (type === "doubleColumnSection") {
      return {
        type: "double",
        left: formatBlocks(section.fields.leftColumn),
        right: formatBlocks(section.fields.rightColumn),
      }
    }

    return null
  }).filter(Boolean)
}

const parseRichText = (richText) => {
  if (!richText?.content) return []

  return richText.content
    .map((node) => {
      switch (node.nodeType) {
        case "heading-1":
          return {
            type: "h1",
            text: getNodeText(node),
          }

        case "heading-2":
          return {
            type: "h2",
            text: getNodeText(node),
          }

        case "heading-3":
          return {
            type: "h3",
            text: getNodeText(node),
          }

        case "paragraph":
          const text = getNodeText(node)
          if (!text) return null
          return {
            type: "p",
            text,
          }

        case "unordered-list":
          return {
            type: "ul",
            items: node.content.map((li) =>
              getNodeText(li.content[0])
            ),
          }

        case "ordered-list":
          return {
            type: "ol",
            items: node.content.map((li) =>
              getNodeText(li.content[0])
            ),
          }

        default:
          return null
      }
    })
    .filter(Boolean)
}

const getNodeText = (node) => {
  if (!node?.content) return ""

  return node.content
    .map((child) => child.value || "")
    .join("")
    .trim()
}

const formatBlocks = (blocks = []) => {
  return blocks
    .map((block) => {
      const type = block.sys.contentType.sys.id

      if (type === "textBlock") {
        return {
          type: "text",
          content: parseRichText(block.fields.richTextContent),
        }
      }

      if (type === "imageBlock") {
        return {
          type: "image",
          image: getImageUrl(block.fields.image),
          alt: block.fields.alt || null,
        }
      }

      return null
    })
    .filter(Boolean)
}

const formatArticleDetail = (article) => ({
  id: article.sys.id,
  title: article.fields.title,
  slug: article.fields.slug,
  category: article.fields.category || null,
  readDuration: article.fields.readDuration || 0,
  description: article.fields.description || null,
  heroImage: getImageUrl(article.fields.heroImage),
  characterImage: getImageUrl(article.fields.characterImage),
  createdAt: article.sys.createdAt,
  sections: formatSections(article.fields.sections),

  // ✅ tambahin ini
  footer: {
    title: article.fields.footerTitle || null,
    description: article.fields.footerDescription || null,
    ctaTitle: article.fields.footerCtaTitle || null,
    ctaDescription: article.fields.footerCtaDescription || null,
  },
})

module.exports = {
  formatArticleList,
  formatPopularArticles,
  formatArticleDetail,
}