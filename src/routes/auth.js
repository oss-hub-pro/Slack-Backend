const router = require("express").Router();
const { register, login, readAllUser, deleteUser, verifyToken } = require('../controllers/auth');
const verify = require("../middleware/tokenVerify");
const multer = require('multer');
const upload = multer({dest: './src/assets/avatar'})

router.post("/register", upload.single('avatar'), register)
router.post("/login", login)
router.get("/verify", verify, verifyToken)

router.get("/", readAllUser)
router.delete("/:id", deleteUser)

module.exports = router