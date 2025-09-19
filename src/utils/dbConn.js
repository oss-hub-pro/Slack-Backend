const mongoose = require("mongoose");

const dbConn = async () => {
    try {
        const db = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        await mongoose.connect(db);
        console.log("db connected")
    } catch (error) {
        console.log("db connection failed: ", error)
    }
}
module.exports = dbConn;