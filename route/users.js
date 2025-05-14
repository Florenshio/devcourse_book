const express = require("express");
const router = express.Router();
const { join, login, requestPasswordReset, updatePassword } = require("../controller/userController");

// 회원 가입
router.post("/join", join);

// 로그인
router.post("/login", login);


// 비밀번호 초기화 요청
router.post("/reset", requestPasswordReset);


// 비밀번호 초기화 (=수정)
router.put("/reset", updatePassword);

module.exports = router;
