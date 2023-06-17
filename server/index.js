const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const File = require("./models/File");
const path = require("path")
const userRoute = require("./routes/user")
const driveRoute = require("./routes/drive")
const bodyParser = require('body-parser');
const isLoggedIn = require('./controllers/isLoggedIn');
const { validateToken } = require('./controllers/auth');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const JWT = require("jsonwebtoken");


const app = express();

// Connect to MongoDB
mongoose.connect(process.env.REACT_APP_MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected...');
}).catch((err) => console.log(err));


// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Initialize multer middleware
const upload = multer({ storage: storage });

//middelwares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use("/user", userRoute)
app.use("/drive", isLoggedIn, driveRoute);


// Start server
const port = process.env.REACT_APP_PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

