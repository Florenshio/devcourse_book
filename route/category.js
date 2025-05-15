const express = require("express");
const router = express.Router();
const { getAllCategories } = require("../controller/categoryController");

// 전체 카테고리 조회
router.get("/", getAllCategories)

module.exports = router;
