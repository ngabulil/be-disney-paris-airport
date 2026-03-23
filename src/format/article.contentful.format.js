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
  return sections
    .map((section) => {
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

      // NEW: double row section
      if (type === "doubleRowSection") {
        return {
          type: "double-row",
          top: formatBlocks(section.fields.topRow),
          bottom: formatBlocks(section.fields.bottomRow),
        }
      }

      return null
    })
    .filter(Boolean)
}

const hasMark = (node, markType) => {
  return Array.isArray(node?.marks) && node.marks.some((mark) => mark.type === markType)
}

const getNodeText = (node, trim = true) => {
  if (!node) return ""

  if (node.nodeType === "text") {
    const value = node.value || ""
    return trim ? value.trim() : value
  }

  const text = (node.content || [])
    .map((child) => getNodeText(child, false))
    .join("")

  return trim ? text.trim() : text
}

// supaya italic jadi block sendiri, bukan nempel di paragraph
const parseParagraphContent = (node) => {
  const chunks = []

  for (const child of node.content || []) {
    const text = getNodeText(child, false)
    if (!text) continue

    const type = hasMark(child, "italic") ? "italic" : "p"
    const lastChunk = chunks[chunks.length - 1]

    if (lastChunk && lastChunk.type === type) {
      lastChunk.text += text
    } else {
      chunks.push({ type, text })
    }
  }

  return chunks
    .map((chunk) => ({
      ...chunk,
      text: chunk.text.trim(),
    }))
    .filter((chunk) => chunk.text)
}

const parseRichText = (richText) => {
  if (!richText?.content) return []

  return richText.content
    .flatMap((node) => {
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

        // NEW: heading-4
        case "heading-4":
          return {
            type: "h4",
            text: getNodeText(node),
          }

        case "paragraph":
          return parseParagraphContent(node)

        case "unordered-list":
          return {
            type: "ul",
            items: node.content.map((li) => getNodeText(li)),
          }

        case "ordered-list":
          return {
            type: "ol",
            items: node.content.map((li) => getNodeText(li)),
          }

        default:
          return null
      }
    })
    .filter(Boolean)
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