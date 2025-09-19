const messageService = require('../services/message');
const channelService = require('../services/channel');
const actions = require('../constants/slackSocketActions');
const multiEmit = require('../utils/multiEmit');
const Message = require('../models/Message');

exports.create = async (socket, data) => {
    try {
        const message = await messageService.create({ sender: socket.userId, ...data });
        let members = data.receivers;
        multiEmit(socket.list, members, `${actions.CREATE_MESSAGE}`, message);
    } catch (err) {
        console.error(err);
        socket.emit(`${actions.CREATE_MESSAGE}`, { ...data, message: err.message });
    }
}

exports.read = async (socket, data = {}) => {
    try {
        const messages = await messageService.read(data);
        socket.emit(`${actions.GET_MESSAGES}`, { ...data, messages });
    } catch (err) {
        socket.emit(`${actions.GET_MESSAGES}`, { ...data, message: err.message });
    }
}

exports.update = async (socket, data) => {
    try {
        await messageService.update(data);
        let tmp = await Message.findById(data._id);
        let members = tmp.receivers;
        multiEmit(socket.list, members, `${actions.EMOTICON}`, '');
    } catch (err) {
        socket.emit(`${actions.UPDATE_MESSAGE}`, { ...data, message: err.message });
    }
}

exports.delete = async (socket, data) => {
    try {
        const result = await Message.findById(data);
        await messageService.delete(data);
        let members = result.receivers;
        multiEmit(socket.list, members, `${actions.EMOTICON}`, '');
    } catch (err) {
        socket.emit(`${actions.DELETE_MESSAGE}`, { ...data, message: err.message });
    }
}

exports.emoticon = async (socket, data) => {
    try {
        await messageService.emoticon(data._id, data.icon, data.del);
        const result = await Message.findById(data._id);
        let members = result.receivers;
        multiEmit(socket.list, members, `${actions.EMOTICON}`, '');
    } catch (err) {
        socket.emit(actions.EMOTICON, { ...data, message: err.message });
    }
}

exports.typing = async (socket, data) => {
    try {
        const channel = await channelService.readOne(data.channelId);
        multiEmit(socket.socketList, channel.members, REQUEST.TYPING, { ...data, user: socket.userId });
        socket.emit(REQUEST.TYPING, STATUS.SUCCESS, data);
    } catch (err) {
        socket.emit(REQUEST.TYPING, { ...data, message: err.message });
    }
}