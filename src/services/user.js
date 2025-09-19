const User = require("../models/User")
const bcrypt = require("bcrypt");
exports.createUser = async (data) => {
    try {
        const newUser = new User({ ...data });
        await newUser.save();
    } catch (error) {
        console.log(error)
        throw new Error("mongodb error");
    }
}
exports.readUser = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        console.log(error)
        throw new Error("mongodb error");
    }
}
exports.readAllUsers = async () => {
    return await User.find();
}
