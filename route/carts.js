const express = require("express");
const router = express.Router();
const { addBookToCart, getCart, deleteBookFromCart } = require("../controller/cartController");

// 장바구니 담기
router.post("/", addBookToCart);

// 장바구니 조회
router.get("/", getCart);


// 장바구니 도서 삭제
router.delete("/:cartItem_id", deleteBookFromCart)


module.exports = router;
