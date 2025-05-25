const express = require("express");
const router = express.Router();
const { order, getOrders, getOrderDetail } = require("../controller/orderController");

// 주문하기 = 결제하기
router.post("/", order);

// 주문 목록(내역) 조회
router.get("/", getOrders);


// 주문 상세 상품 조회
router.get("/:order_id", getOrderDetail);


module.exports = router;
