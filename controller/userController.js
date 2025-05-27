const { StatusCodes } = require("http-status-codes");
const connection = require("../mariadb");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const join = (req, res) => {
    const { email, password } = req.body;

    const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
    const salt = crypto.randomBytes(64).toString("base64");
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");
    
    const value = [email, hashedPassword, salt];

    connection.query(sql, value, (err, result) => {
        if (err) {
            
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        
        }
        
        if (result.affectedRows) {
            return res.status(StatusCodes.CREATED).json({ message: "회원가입 성공" });
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "회원가입 실패" });
        }
    })
}

const login = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    const value = [email];
    const userPassword = password;
    
    connection.query(sql, value, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        } else {
            if (result.length > 0) {

                const { email, password, salt } = result[0];
                const hashedPasswordFromUser = crypto.pbkdf2Sync(userPassword, salt, 10000, 64, "sha512").toString("base64");

                if (hashedPasswordFromUser === password) {
                    
                    const token = jwt.sign(
                        { "email": email,
                            "id": result[0].id
                         }, 
                        process.env.JWT_SECRET, 
                        { expiresIn: "1h", 
                            algorithm: "HS256",
                            issuer: "florenshio",
                            subject: "user"
                        });
                    
                    res.cookie("token", token);
                    return res.status(StatusCodes.OK).json({ message: "로그인 성공" });

                } else {
                    
                    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 실패" });
                }
            } else {
                
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "로그인 실패" });
            }
        }
    })
}

const requestPasswordReset = (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    const value = [email];
    
    connection.query(sql, value, (err, result) => {
        if (err) {
            
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        
        } else {
            if (result.length > 0) {
                
                return res.status(StatusCodes.OK).json({ "email": email });
            
            } else {
                
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "비밀번호 초기화 요청 실패" });
            }
        }
    })
}

const updatePassword = (req, res) => {
    const { email, password } = req.body;

    const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";

    const salt = crypto.randomBytes(64).toString("base64");
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

    const value = [hashedPassword, salt, email];
    
    connection.query(sql, value, (err, result) => {
        if (err) {
            
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "서버 오류" });
        
        } else {
            
            return res.status(StatusCodes.OK).json({ message: "비밀번호 초기화 성공" });
        }
    })
}

module.exports = {
    join,
    login,
    requestPasswordReset,
    updatePassword
}
