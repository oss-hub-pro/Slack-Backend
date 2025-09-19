const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { readUser, createUser, readAllUsers } = require("../services/user")
const generateTokens = require('../utils/generateTokens');
const User = require("../models/User");
const actions = require("../constants/slackSocketActions");
const { readAllMatchedMe } = require("../services/channel");
const { fetchChannels } = require("./channel");
const multiEmit = require("../utils/multiEmit");
const File = require("../models/File");


exports.register = async (req, res) => {
    try {
        const { email } = req.body;
        if (await readUser(email)) {
            res.status(200).json({ message: "Plz use another email", status: "info" })
        } else {
            let avatar = req.file?.filename;
            if(!avatar) avatar = 'default.jpg';
            await createUser({ ...req.body, password: await bcrypt.hash(req.body.password, 10), avatar});
            res.status(201).json({ message: "Registered", status: "success" })
        }
    } catch (error) {
        res.status(500).json({ data: error, message: "Error", status: "error" })
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) res.status(200).json({ message: "You are not registered", status: "warning" })
        else {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const token = generateTokens(user);
                res.status(200).json({
                    user,
                    token: token,
                    message: "Login success",
                    status: "success"
                })
            } else res.status(200).json({ message: "Password incorrect", status: "warning" })
        }
    } catch (error) {
        res.status(500).json({ data: error, message: "Error", status: "error" })
    }
}
exports.verifyToken = (req, res) => {
    res.status(200).json({ user: req.user, message: "token verify success" })
}

exports.fetchAllUsers = async (socket, data) => {
    try {
        const result = await readAllUsers()
        socket.emit(actions.GET_ALL_USERS, result);
    } catch (error) {
        console.log(error);
        socket.emit(actions.ERROR, "error")
    }
}
exports.readAllUser = async (req, res) => {
    const result = await User.find();
    res.status(200).json(result);
}

exports.deleteUser = async (req, res) => {
    const result = await User.findByIdAndDelete(req.params.id);
    res.json(result);
}

exports.updateUser = async (socket, data) => {
    let { _id, status } = data;
    await User.updateOne({ _id }, { status: status });

    const result = await readAllMatchedMe(_id)
    let tmp = [];
    result.data.forEach(user => {
        user.members.forEach((user_Id) => {
            if(!tmp.includes(user_Id)) tmp.push(user_Id._id);
        })
    });
    multiEmit(socket, tmp, `${actions.STATUS}`, '')
}

exports.sendContact = async (socketList) => {
    let users= await User.find({});
    let userIdList = users.map((user) => {return user._id});
    multiEmit(socketList, userIdList, actions.GET_ALL_USERS, users)
}

exports.updateFileList = async (socketList) => {
    let users= await User.find({});
    let userIdList = users.map((user) => {return user._id});
    let files = await File.find({});
    multiEmit(socketList, userIdList, actions.FILES, files)
}

