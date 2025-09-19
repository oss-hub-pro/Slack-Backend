const Channel = require("../models/Channel");
exports.createOne = async (data) => {
    try {
        if (data.creater == null) {
            const query = { members: [...data.members] }
            const isExist = (await Channel.find(query)).length != 0;
            if (isExist) return { status: false, message: "already exist." }
        }
        const newChannel = new Channel({ ...data });
        await newChannel.save()
        return { status: true, members: data.members }
    } catch (error) {
        console.log(error)
        throw new Error("mongodb error");
    }
}
exports.updateOne = async (data) => {
    try {
        let members = (await Channel.findById(data._id)).members;
        await Channel.findByIdAndUpdate(data._id, data);
        data.members.forEach(v => {
            if (members.indexOf(v) >= 0) { }
            else {
                members.push(v)
            }
        })
        members = members.map(v => { return String(v) });
        return { status: true, members }
    } catch (error) {
        console.log(error)
        throw new Error("mongodb error");

    }
}
exports.deleteOne = async (id) => {
    try {
        let members = (await Channel.findById(id)).members;
        await Channel.findByIdAndDelete(id);
        members = members.map(v => { return String(v) });
        return { status: true, members }
    } catch (error) {
        console.log(error)
        throw new Error("mongodb error");

    }
}
exports.readAllMatchedMe = async (id) => {
    try {
        const query = {
            members: { $in: id }
        }
        const result = await Channel.find(query).populate("members");
        return { status: true, data: result };
    } catch (error) {
        console.log(error)
        throw new Error("mongodb error");
    }

}
