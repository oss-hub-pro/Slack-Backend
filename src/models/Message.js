const mongoose = require("mongoose");
const Message = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        default:null
    },
    content: {
        type: String,
        default: ""
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        default: null
    },
    pins: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    emoticons: [{
        id: {
            type: String,
        },
        cnt: {
            type: Number,
            default: 0
        },
    }],
    isDirect: {
        type: Boolean,
        default: false
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    sendTime: {
        type: String,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
})
module.exports = mongoose.model("Message", Message);