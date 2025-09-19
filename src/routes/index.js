const authRoute = require("./auth")
const fileRoute = require("./fileRoute")

const route = (app) => {
    app.use("/api/auth", authRoute);
    app.use('/file', fileRoute)
}
module.exports = route