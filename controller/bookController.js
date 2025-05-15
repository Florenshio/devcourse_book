const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");

const getAllBooks = (req, res) => {
    const category_id = req.query.category_id;

    if (category_id) {
        const sql = "SELECT * FROM books WHERE category_id = ?";
        const value = [category_id];

        connection.query(sql, value, (err, result) => {
            if (err) {
                
                console.error(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
            
            } else {
                
                if (result.length > 0) {
                    return res.status(StatusCodes.OK).json(result);
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({ message: "도서가 없습니다." });
                }
            }
        })
    } else {
        const sql = "SELECT * FROM books";
        const value = [];

        connection.query(sql, value, (err, result) => {
            if (err) {
                
                console.error(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
            
            } else {
                
                if (result.length > 0) {
                    return res.status(StatusCodes.OK).json(result);
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({ message: "도서가 없습니다." });
                }
            }
        })
    }

}

const getBookById = (req, res) => {
    const book_id = req.params.book_id;

    const sql = "SELECT * FROM books WHERE id = ?"
    const value = [book_id];

    connection.query(sql, value, (err, result) => {
        if (err) {
            
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        
        } else {
            
            if (result.length > 0) {
                return res.status(StatusCodes.OK).json(result[0]);
            } else {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "도서가 없습니다." });
            }
        }
    })
}

module.exports = {
    getAllBooks,
    getBookById
}
