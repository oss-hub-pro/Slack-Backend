const mongoose = require("mongoose");
const User = new mongoose.Schema({
    username: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        match: /^[^\s@]+\@[^\s@]+\.[^\s@]+$/,
        require: true,
        unique: true
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 4
    }
})
module.exports = mongoose.model("User", User);