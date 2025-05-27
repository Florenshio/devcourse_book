const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");
const { ensureAuthorization } = require("../auth");
const jwt = require("jsonwebtoken");

const addLike = (req, res) => {
    const { book_id } = req.params;
    let user_id = ensureAuthorization(req, res);

    if (user_id instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료되었습니다." });
    } else if (user_id instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
    }

    let sql = "INSERT INTO likes (user_id, liked_books_id) VALUES (?, ?)";
    let value = [user_id, book_id];

    connection.query(sql, value, (err, result) => {
        if (err) {
            
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        
        } else {
            
            return res.status(StatusCodes.OK).json({ message: "좋아요 추가 성공" });
        }
    })
}

const removeLike = (req, res) => {
    const { book_id } = req.params;
    let user_id = ensureAuthorization(req, res);

    if (user_id instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료되었습니다." });
    } else if (user_id instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
    }

    let sql = "DELETE FROM likes WHERE user_id = ? AND liked_books_id = ?";
    let value = [user_id, book_id];

    connection.query(sql, value, (err, result) => {
        if (err) {
            
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        
        } else {
            
            return res.status(StatusCodes.OK).json({ message: "좋아요 삭제 성공" });
        }
    })
}


module.exports = {
    addLike,
    removeLike
}
