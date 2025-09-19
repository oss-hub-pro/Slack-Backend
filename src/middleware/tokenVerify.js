const jwt = require("jsonwebtoken");
const User = require("../models/User")
const verify = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = jwt.verify(token, process.env.SECRET);
        if (!user) res.status(401).json({ message: "unauthorization" })
        const userData = await User.findOne({ _id: user.id });
        req.user = userData;
        next();
    } catch (error) {
        res.status(401).json({ message: "unauthorization" })
    }
}
module.exports = verify;