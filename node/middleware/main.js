const userModel = require("../models/userSchema");
const bcrypt = require('bcrypt');
const isImageURL = require('image-url-validator').default;

module.exports = {
    validateUserRegister: async (req, res, next) =>  {
        const {username, password1, password2} = req.body

        if(username.length < 3)
            return res.send({error: false, data: "Username should contain at least 3 characters"})

        const response = await userModel.find({username: username})

        if(response[0])
            return res.send({error: false, data: "User already exists"})

        if(password1 !== password2)
            return res.send({error: true, data: "Passwords do not match"})

        if((password1.length < 4 || password1.length > 20))
            return res.send({error: true, data: "Password length should be between 4 and 20 characters"})

        next()
    },

    validateUserLogin: async (req, res, next) =>  {
        const {username, password} = req.body

        const response = await userModel.findOne({username: username})

        if(response){
            const compare = await bcrypt.compare(password, response.password)

            if(!compare)
                return res.send({error: true, data: "Incorrect password"})
        }

        else
            return res.send({error: true, data: "User not found"})

        next()
    },

    validateBid: async (req, res, next) =>
    {
        if(req.body.price <= req.body.startPrice)
            return res.send({error: true, data: "Bid price needs to higher than the start price"})

        if(req.body.price <= req.body.currentPrice)
            return res.send({error: true, data: "Bid price needs to higher than the current price"})

        if(req.body.price > req.body.money)
            return res.send({error: true, data: "You don't have enough money"})

        next()
    },

    checkAuctionData: async (req, res, next) => {
        const {title, startPrice, image} = req.body

        if(!await isImageURL(image) && !image.includes("data:image"))
            return res.send({error: true, data: "Invalid image URL"})

        if(title.length < 20 || title.length > 500)
            return res.send({error: true, data: "Title length should be between 20 and 500 characters"})

        if(isNaN(startPrice) || startPrice < 5)
            return res.send({error: true, data: "Start price can't be lower than 5"})

        next()
    }
}