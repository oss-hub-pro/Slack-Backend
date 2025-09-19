const File = require('../models/File')

exports.uploadFiles = async (req, res) => {
    try {
        let fileList = req.files;
        if (!fileList.length) res.json('err');
        let { sender, receivers, channel} = req.body;
        let tmp = (receivers.split(','));
        let files = fileList.map((file) => {
            return { originalname: file.originalname, filename: file.filename }
        });
        let file = new File({ sender, receivers:tmp, files, channel });
        await file.save();
        res.json('');
    } catch (error) {
        res.status(500).json({ data: error, message: "Error", status: "error" })
    }
}