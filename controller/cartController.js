const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");

const addBookToCart = (req, res) => {
    const { user_id, quantity, book_id } = req.body;

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
    const { user_id, selected } = req.body;

    let sql = `SELECT cartitems.id, book_id, title, summary, quantity, price
             FROM cartitems LEFT JOIN books
             ON cartitems.book_id = books.id
             WHERE user_id = ? AND cartitems.id IN (?)`;
    let value = [user_id, selected];

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
    const { book_id } = req.params;

    let sql = "DELETE FROM cartitems WHERE id = ?";
    let value = [book_id];

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

