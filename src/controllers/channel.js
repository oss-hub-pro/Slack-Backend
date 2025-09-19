const actions = require("../constants/slackSocketActions");
const Channel = require("../models/Channel");
const { createOne, readAllMatchedMe, updateOne, deleteOne } = require("../services/channel")
const multiEmit = require("../utils/multiEmit")
exports.createChannel = async (socket, data) => {
    try {
        const result = await createOne(data);
        if (result.status) { multiEmit(socket.list, result.members, actions.CREATE_CHANNEL) }
        else { socket.emit(actions.ERROR, result.message) };
    } catch (error) {
        console.log(error);
        socket.emit(actions.ERROR, "error")
    }
}
exports.fetchChannels = async (socket, id) => {
    try {
        const result = await readAllMatchedMe(id)
        if (result.status) socket.emit(actions.GET_CHANNELS, result.data)
    } catch (error) {
        console.log(error);
        socket.emit(actions.ERROR, "error")
    }
}
exports.updateChannel = async (socket, data) => {
    try {
        const result = await updateOne(data)
        if (result.status) multiEmit(socket.list, result.members, actions.CREATE_CHANNEL)
    } catch (error) {
        console.log(error);
        socket.emit(actions.ERROR, "error")
    }
}
exports.deleteChannel = async (socket, id) => {
    try {
        const result = await deleteOne(id)
        if (result.status) multiEmit(socket.list, result.members, actions.CREATE_CHANNEL)
    } catch (error) {
        console.log(error);
        socket.emit(actions.ERROR, "error")
    }
}
