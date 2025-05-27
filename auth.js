const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthorization = (req, res) => {
    try {
        let receivedJwt = req.headers["authorization"];

        if (receivedJwt) {
            let decodedJwt = jwt.verify(receivedJwt, process.env.JWT_SECRET);
            return decodedJwt.id;
        } else {
            throw new ReferenceError("jwt must be provided");
        }
    } catch (error) {
        return error;
    }
}

module.exports = {
    ensureAuthorization
}
