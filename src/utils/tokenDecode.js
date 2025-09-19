const jwt = require('jsonwebtoken')

module.exports = loginByToken = (token) => {
    try {
        const user = jwt.verify(token, process.env.SECRET);
        return user;
    } catch (error) {
        throw new Error("UnAuthorization");
    }
}