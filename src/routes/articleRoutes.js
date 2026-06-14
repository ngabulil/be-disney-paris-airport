const express = require("express")
const router = express.Router()
const controller = require("../controllers/articleControllers")

router.get("/", controller.getArticles)
router.get("/popular", controller.getPopularArticles)
router.get("/:slug", controller.getArticleDetail)

module.exports = router