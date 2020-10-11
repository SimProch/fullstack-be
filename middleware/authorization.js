const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req, res, next) => {
    try {
        const token = req.header("token");
        if (!token) return res.status(403).json("Unauthorized");
        const payload = jwt.verify(token, process.env.jwtSecret);
        req.user = payload.user;
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Unauthorized");
    }
}