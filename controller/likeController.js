const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");

const addLike = (req, res) => {
    const { user_id } = req.body;
    const { book_id } = req.params;

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
    const { user_id } = req.body;
    const { book_id } = req.params;

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
