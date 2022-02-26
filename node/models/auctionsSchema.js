const mongoose = require("mongoose")
const Schema = mongoose.Schema

const auctionSchema = new Schema ({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    startPrice: {
        type: Number,
        required: true
    },
    endTime: {
        type: Number,
        required: true
    },
    bids: {
        type: Array,
        default: []
    },
    ended: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("auctionModel", auctionSchema)