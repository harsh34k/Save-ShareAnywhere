const JWT = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();
const secret = process.env.REACT_APP_SECRET_KEY;
// process.env.REACT_APP_SECRET_KEY
function createTokenForUser(user) {
    const paylod = {
        _id: user._id,
        username: user.username,
    }
    const token = JWT.sign(paylod, secret);
    return token;
}

function validateToken(token) {
    if (!token) {
        return null
    }
    try {
        const payload = JWT.verify(token, secret);
        return payload;
    } catch (error) {
        // console.log("error", error);
        return null; // Token is invalid, return null
    }
}
module.exports = { createTokenForUser, validateToken };