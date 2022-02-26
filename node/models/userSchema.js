const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        default: 1000
    }
})

module.exports = mongoose.model("userModel", userSchema)