const router = require("express").Router();
const multer = require('multer');
const upload = multer({ dest: 'src/assets/files' })
const { uploadFiles } = require('../controllers/files');
const { path } = require('../..')

router.post("/upload", upload.array('files'), uploadFiles)


module.exports = router