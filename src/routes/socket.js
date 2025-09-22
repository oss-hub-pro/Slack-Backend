const actions = require("../constants/slackSocketActions")
const loginByToken = require("../utils/tokenDecode")
const { fetchAllUsers, updateUser, sendContact, updateFileList, sendTyping} = require("../controllers/auth")
const { createChannel, fetchChannels, updateChannel, deleteChannel } = require("../controllers/channel.js")
const message = require('../controllers/message.js')
const socketArr = {};

const authMdr = (socket, data, next) => {
    try {
        const token = socket.handshake.headers.token;
        const user = loginByToken(token);
        if (!socket[user.id]) socketArr[user.id] = [socket];
        else {
            if (socketArr[user.id].find(v => v == socket.id)) { }
            else {
                socketArr[user.id].push(socket)
            }
        }
        socket.list = socketArr;
        next(socket, data);
    } catch (err) {
        socket.emit(actions.ERROR, err.message);
    }
}

exports.socketRoutes = (socket) => {
    console.log(`${socket.id} is connected.`);
    socket.list = socketArr;
    socket.on(actions.AUTH, (token) => {
        const user = loginByToken(token);
        if (user) {
            if (!socketArr[user.id]) {
                socketArr[user.id] = [];
            }
            socket.userId=user.id;
            socketArr[user.id].push(socket);
        }
        sendContact(socketArr);
    });
    socket.on(actions.AUTH, (data) => { authMdr(socket, data, fetchAllUsers) });
    socket.on(actions.GET_ALL_USERS, () => { authMdr(socket, {}, fetchAllUsers) });
    socket.on(actions.CREATE_CHANNEL, (data) => { authMdr(socket, data, createChannel) });
    socket.on(actions.GET_CHANNELS, (id) => { authMdr(socket, id, fetchChannels) });
    socket.on(actions.UPDATE_CHANNEL, (data) => { authMdr(socket, data, updateChannel) });
    socket.on(actions.DELETE_CHANNEL, (id) => { authMdr(socket, id, deleteChannel) });

    socket.on(`${actions.GET_MESSAGES}`, (data) => authMdr(socket, data, message.read));
    socket.on(`${actions.CREATE_MESSAGE}`, (data) => authMdr(socket, data, message.create));
    socket.on(`${actions.UPDATE_MESSAGE}`, (data) => authMdr(socket, data, message.update));
    socket.on(`${actions.DELETE_MESSAGE}`, (data) => authMdr(socket, data, message.delete));
    socket.on(actions.EMOTICON, (data) => authMdr(socket, data, message.emoticon));
    
    socket.on(actions.FILES, () => updateFileList(socketArr))
    socket.on(actions.UPDATE, data => updateUser(socketArr, data))
    socket.on(actions.TYPING, data => sendTyping(socketArr, data))
}