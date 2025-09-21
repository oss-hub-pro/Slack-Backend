const mongoose = require("mongoose")
const File = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    files: [{
        originalname: {
            type: String,
            require: true
        },
        filename: {
            type: String,
            require: true,
        }
    }],
    channel:{
        type:mongoose.Schema.Types.ObjectId,
    }

})
module.exports = mongoose.model("File", File)