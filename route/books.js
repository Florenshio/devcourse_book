const express = require("express");
const router = express.Router();

// 전체 도서 조회
router.get("/", (req, res) => {
    res.json("전체 도서 조회")

    // 카테고리별 도서 목록 조회용 분기 구현 필요
})

// 개별 도서 조회
router.get("/:book_id", (req, res) => {
    res.json("개별 도서 조회")
})

module.exports = router;
