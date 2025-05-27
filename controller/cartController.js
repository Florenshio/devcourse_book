const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");
const { ensureAuthorization } = require("../auth");
const jwt = require("jsonwebtoken");

const addBookToCart = (req, res) => {
    const { quantity, book_id } = req.body;
    let user_id = ensureAuthorization(req, res);

    if (user_id instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료되었습니다." });
    } else if (user_id instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
    }

    let sql = "INSERT INTO cartitems (book_id, quantity, user_id) VALUES (?, ?, ?)";
    let value = [book_id, quantity, user_id];

    connection.query(sql, value, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        } else {
            return res.status(StatusCodes.OK).json({ message: "장바구니에 추가되었습니다." });
        }
    })
}

const getCart = (req, res) => {
    const { selected } = req.body;
    let user_id = ensureAuthorization(req, res);

    if (user_id instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료되었습니다." });
    } else if (user_id instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
    } else {

        let sql = `SELECT cartitems.id, book_id, title, summary, quantity, price
             FROM cartitems LEFT JOIN books
             ON cartitems.book_id = books.id
             WHERE user_id = ?`;
        let value = [user_id];

        if (selected) { // 주문서 작성 시 '선택한 장바구니 목록 조회'
            sql += " AND cartitems.id IN (?)";
            value.push(selected);
        }
    }

    connection.query(sql, value, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        } else {
            return res.status(StatusCodes.OK).json(result);
        }
    })
}

const deleteBookFromCart = (req, res) => {
    let user_id = ensureAuthorization(req, res);
    
    if (user_id instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료되었습니다." });
    } else if (user_id instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
    }
    
    const { cartItem_id } = req.params;

    let sql = "DELETE FROM cartitems WHERE id = ?";
    let value = [cartItem_id];

    connection.query(sql, value, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        } else {
            return res.status(StatusCodes.OK).json({ message: "장바구니에서 삭제되었습니다." });
        }
    })
}

module.exports = {
    addBookToCart,
    getCart,
    deleteBookFromCart
}

