const express = require("express");
const router = express.Router();
const { getAllBooks, getBookById } = require("../controller/bookController");

// 전체 도서 조회
router.get("/", getAllBooks)

// 개별 도서 조회
router.get("/:book_id", getBookById)

module.exports = router;
