const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");

const getAllBooks = (req, res) => {
    const { category_id, is_new, limit, current_page } = req.query;

    let sql = "SELECT * FROM books";
    let value = [];
    let offset = (current_page - 1) * limit;

    if (category_id && is_new) {
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        value.push(category_id);
    } else if (category_id) {
        sql += " WHERE category_id = ?";
        value.push(category_id);
    } else if (is_new) {
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }

    sql += " LIMIT ? OFFSET ?";
    value.push(parseInt(limit), offset);

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

const getBookById = (req, res) => {
    const book_id = req.params.book_id;

    const sql = `SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?`;
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
