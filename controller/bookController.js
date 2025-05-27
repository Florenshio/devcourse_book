const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");
const { ensureAuthorization } = require("../auth");
const jwt = require("jsonwebtoken");

const getAllBooks = (req, res) => {
    let allBooksRes = {};
    const { category_id, is_new, limit, current_page } = req.query;

    let sql = "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_books_id = books.id) AS likes FROM books";
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
                // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
            
            } else {
                
                if (result.length) {
                    allBooksRes.books = result;
                } else {
                    return res.status(StatusCodes.NOT_FOUND).json({ message: "도서가 없습니다." });
                }
            }
        })

    sql = " SELECT FOUND_ROWS()";
    connection.query(sql, value, (err, result) => {
            if (err) {
                
                console.error(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
            
            } else {
                
                let pagination = {};
                pagination.current_page = parseInt(current_page);
                pagination.total_count = result[0]["FOUND_ROWS()"];
                allBooksRes.pagination = pagination;

                return res.status(StatusCodes.OK).json(allBooksRes);
            }
        })
    }

const getBookById = (req, res) => {
    // 로그인 상태가 아니면 => liked 빼고 보내주기
    // 로그인 상태면 => liked 포함해서 보내주기
    let user_id = ensureAuthorization(req, res);
    
    if (user_id instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 세션이 만료되었습니다." });
    } else if (user_id instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "잘못된 토큰입니다." });
    } else if (user_id instanceof ReferenceError) {
        const book_id = req.params.book_id;

        const sql = `SELECT *, 
                    (SELECT count(*) FROM likes WHERE liked_books_id = books.id) AS likes
                    FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?`;
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

    } else {

    const book_id = req.params.book_id;

    const sql = `SELECT *, 
                (SELECT count(*) FROM likes WHERE liked_books_id = books.id) AS likes,
                (SELECT EXISTS(SELECT * FROM likes WHERE user_id = ? AND liked_books_id = ?)) AS liked 
                FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id = ?`;
    const value = [user_id, book_id, book_id];

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
}

module.exports = {
    getAllBooks,
    getBookById
}
