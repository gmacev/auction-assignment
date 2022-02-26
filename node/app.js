const PORT = 4017
const PORT_SOCKETS = 4018

const cors = require('cors')
const express = require('express')
const router = require("./routes/main")
const app = express()
const mongoose = require('mongoose')
const userModel = require("./models/userSchema")
const session = require('express-session')

require("dotenv").config()

mongoose.connect(process.env.MONGO_KEY)
    .then(res => {
        console.log("Connection to MongoDB OK")
    }).catch(error => {
    console.log(`Connection to MongoDB FAILED: ${error}`)
})

app.use(cors({origin: true, credentials: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE"}))
app.use(express.json()) // to read req.body
app.listen(PORT)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use("/", router)

const http = require('http').createServer(app)

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
})

http.listen(PORT_SOCKETS, () => {
    console.log("Sockets server listening on port " + PORT_SOCKETS)
})

module.exports.ioObject = io