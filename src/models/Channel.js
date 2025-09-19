const mongoose = require("mongoose")
const Channel = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    creater: {
        type: String,
        default: null
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})
module.exports = mongoose.model("Channel", Channel);