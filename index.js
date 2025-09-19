const express = require("express");
const http = require("http");
const bodyParser = require('body-parser')
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConn = require("./src/utils/dbConn")
const { socketRoutes } = require("./src/routes/socket")
const path = require('path');

dotenv.config();

const app = express();

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
require('./src/models/User');

app.use('/', express.static('public'));
app.use('/avatar', express.static('src/assets/avatar'))
app.get('/download/:filename/:originalname', (req, res) => {
    const { filename, originalname } = req.params;
    const filePath = path.join(__dirname + '/src/assets/files/' + filename);
    console.log(filename, originalname, filePath)
    res.download(filePath, originalname)
});
require("./src/routes/index")(app);

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    },
});

io.on("connection", socketRoutes);

const port = process.env.PORT || 5000;

server.listen(port, async () => {
    try {
        await dbConn();
        console.log(`Server is running on port ${port}`);
    } catch (err) {
        console.error(err);
    }
});
