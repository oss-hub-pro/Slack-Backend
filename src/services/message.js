const Message = require("../models/Message");

exports.create = (createMessageDto) => {
    const message = new Message(createMessageDto);
    let time = new Date();
    message.sendTime = time;
    return message.save();
}

exports.read = async (data) => {
    const messages = await Message.find(data);
    if (data.parent == null) {
        const children = await Message.find().in('parent', messages.map(message => message.id));
        return messages.map((message) => {
            const childCount = children.filter(child => child.parent == message.id).length;
            message.childCount = childCount;
            return message;
        });
    }
    return messages;
}

exports.readOne = async (id) => {
    const message = await Message.findById(id);
    if (!message)
        throw new Error('Not found message');
    const childCount = await Message.find({ parent: id }).count();
    message.childCount = childCount;
    return message;
}

exports.update = async (data) => {
    let { _id, pins, content } = data;
    console.log(data)
    const message = await Message.findById(_id);
    if (!message) throw new Error('Not found message');
    if (pins != '') {
        let msgPins = message.pins;
        if (msgPins.includes(pins)) {
            msgPins = msgPins.filter((id) => id != pins);
        }
        else msgPins.push(pins);
        await Message.findByIdAndUpdate(_id, { pins: msgPins });
    }
    if(content) {
        await Message.findByIdAndUpdate(_id, {content});
    }
}

exports.delete = async (id) => {
    await Message.findByIdAndDelete(id);
}

exports.emoticon = async (id, icon, del) => {
    const message = await Message.findById(id);
    let emoticons = message.emoticons, flag = false;
    emoticons = emoticons.map((info) => {
        if (info.id == icon) {
            flag = true;
            if (del)
                return { id: icon, cnt: info.cnt - 1 };
            else return { id: icon, cnt: info.cnt + 1 };
        }
        else return info;
    })
    if (!flag) emoticons.push({ id: icon, cnt: 1 })
    emoticons = emoticons.filter((info) => info.cnt > 0);
    await Message.findByIdAndUpdate(id, { emoticons: emoticons });
}