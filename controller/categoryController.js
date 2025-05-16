const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");

const getAllCategories = (req, res) => {

    let sql = "SELECT * FROM categories";
    let value = [];

    connection.query(sql, value, (err, result) => {
        if (err) {
            
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        
        } else {
            
            if (result.length > 0) {
                return res.status(StatusCodes.OK).json(result);
            } else {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "카테고리가 없습니다." });
            }
        }
    })
}



module.exports = {
    getAllCategories
}
