const express = require("express");
const router = express.Router();
const { addLike, removeLike } = require("../controller/likeController");

// 좋아요 추가
router.post("/:book_id", addLike);

// 좋아요 삭제
router.delete("/:book_id", removeLike);


module.exports = router;
