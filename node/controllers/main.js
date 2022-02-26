const { v4: uuidv4 } = require('uuid')
const userModel = require("../models/userSchema");
const auctionsModel = require("../models/auctionsSchema");
const bcrypt = require('bcrypt');
const socket = require('../app');

let auctions = []

// get auctions from DB or local array
const getAuctions = async (fromDb) => fromDb ? auctions = await auctionsModel.find({}) : auctions

getAuctions(true)

const schedule = require('node-schedule');

let timer = 0, inUpdate = false

const job = schedule.scheduleJob('*/1 * * * * *', async () => {
    if(auctions.length === 0)
        return

    // timer every second
    if(!inUpdate)
    {
        timer++

        auctions.map(async (auction, index) => {
            if(new Date().getTime() >= auction.endTime)
            {
                if(!auction.ended)
                {
                    inUpdate = true

                    // update auction as ended
                    await auctionsModel.findOneAndUpdate({_id: auction._id}, {$set: {ended: true}}, {new: true})

                    auctions[index].ended = true
                    inUpdate = false

                    // if auction had any bidders, transfer the money from the last bidder to the auction creator
                    if(auction.bids && auction.bids[0]){
                        await userModel.findOneAndUpdate({username: auction.username}, {$inc: {money: auction.bids[0].price}})
                    }
                }
            }

            else
                auctions[index].endTime -= 1000
        })
    }

    // each 30 seconds, update auctions array to DB, so we don't lose too much auction endTime data in case of a server crash
    if(timer === 30)
    {
        inUpdate = true
        timer = 0

        auctions.map(async (x, index) =>
        {
            if(!x.ended) {
                try {
                    await auctionsModel.findOneAndUpdate({_id: x._id}, {$set: x}, {new: true}, (err, updated) => {
                        console.log(err, updated)
                        auctions[index] = updated
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        })

        inUpdate = false
    }
})

module.exports = {
    registerUser: async (req, res) => {
        try {
            const {username, password1} = req.body

            const user = new userModel()
            const hash = await bcrypt.hash(password1, 10)

            user.username = username
            user.password = hash

            const response = await user.save()

            return res.send({error: false, data: response && response.username === user.username ? "User registered successfully" : response})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },
    login: async (req, res) => {
        try {
            const {username} = req.body

            const response = await userModel.find({username: username})

            req.session.username = response[0].username

            return res.send({error: false, data: "Login successful", _id: response[0]._id, username: response[0].username, money: response[0].money})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    logOut: async (req, res) => {
        if(req.session.username) {
            req.session.destroy()
            return res.send({error: false, data: "Logged out"})
        }

        return res.send({error: true, data: "Not logged in"})
    },

    postAuction: async (req, res) => {
        if(!req.session.username)
            return res.send({error: true, data: "Not logged in"})

        const {image, title, startPrice, endTime, username} = req.body

        const auction = new auctionsModel()
        const date = Date.now()

        auction.image = image
        auction.title = title
        auction.username = req.session.username
        auction.startPrice = startPrice
        auction.endTime = date + endTime
        auction.username = username

        await auction.save()

        // save the auction to local array to save resources in timer
        auctions.push(auction)

        inUpdate = true

        auctions.map(async (x, index) =>
        {
            try{
                await auctionsModel.findOneAndUpdate({_id: x._id}, {$set: x}, {new: true}, (err, doc) => {
                    auctions[index] = doc
                })
            } catch (e){
                console.log(e)
            }
        })

        inUpdate = false

        return res.send({error: false, data: "Auction created successfully"})
    },

    postBid: async (req, res) => {

        try {
            if(!req.session.username)
                return res.send({error: true, data: "Not logged in"})

            const bid = {
                username: req.body.username,
                price: req.body.price,
                bidTime: req.body.bidTime
            }

            // find the bid's auction
            const oldAuction = await auctionsModel.findOne({_id: req.body._id})

            // if it had any previous bids, return the money to the last bidder
            if(oldAuction.bids[0])
                await userModel.findOneAndUpdate({username: oldAuction.bids[0].username}, {$inc: {money: oldAuction.bids[0].price}})

            // take away bid price from the bidder's money
            const updatedUser = await userModel.findOneAndUpdate({username: req.body.username}, {$set: {money: req.body.money - req.body.price}}, {new: true})
            // push the bid with unshift logic
            const response = await auctionsModel.findOneAndUpdate({_id: req.body._id}, {$push: {bids: {$each: [bid], $position: 0}}}, {new: true})

            auctions[auctions.findIndex((el) => el.id === req.body._id)].bids = response.bids

            inUpdate = true

            auctions.map(async (x, index) =>
            {
                try{
                    await auctionsModel.findOneAndUpdate({_id: x._id}, {$set: x}, {new: true}, (err, doc) => {
                        auctions[index] = doc
                    })
                } catch (e){
                    console.log(e)
                }
            })

            inUpdate = false

            socket.ioObject.emit("auction", response)

            return res.send({error: false, data: response, money: updatedUser.money})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    getAllAuctions: async (req, res) => {
        try {
            if(!req.session.username)
                return res.send({error: true, data: "Not logged in"})

            const aucs = await getAuctions(false)

            return res.send({error: false, data: aucs})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    getUserAuctions: async (req, res) => {
        try {
            if(!req.session.username)
                return res.send({error: true, data: "Not logged in"})

            const response = await getAuctions(false)

            const userAuctions = response.filter((x, index) => x.username === req.session.username)

            return res.send({error: false, data: userAuctions})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },


    getAllBids: async (req, res) => {
        try {
            if(!req.session.username)
                return res.send({error: true, data: "Not logged in"})

            const response = await auctionsModel.findOne({_id: req.body._id})

            return res.send({error: false, data: response.bids})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    getUserBids: async (req, res) => {
        try {
            console.log("getBids")
            if(!req.session.username)
                return res.send({error: true, data: "Not logged in"})

            const aucs = await getAuctions(true)

            console.log("getBids")
            const userBids = []

            aucs.map((auction, index) => {
                if(auction.bids.length > 0) {
                    const uBids = auction.bids.filter((bid) => bid.username === req.session.username)

                    uBids.map(bid => {
                        userBids.unshift({bid: bid, auction: auction._id})
                    })
                }
            })

            console.log(userBids)

            return res.send({error: false, data: userBids})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    getSingleAuctionData: async (req, res) => {
        try {
            if(!req.session.username)
                return res.send({error: true, data: "Not logged in"})

            const response = await auctionsModel.findOne({_id: req.body._id})

            return res.send({error: false, data: response})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    getUserData: async (req, res) => {
        try {
            console.log("getUserData: ", req.session)

            if(!req.session.username)
                return res.send({error: true, data: "Not logged in"})

            const response = await userModel.find({username: req.session.username})

            return res.send({error: false, _id:  response[0]._id, username: response[0].username, money: response[0].money})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    updateUser: async (req, res) => {
        try {
            if(!req.session.username)
                return res.send({error: true, data: "Not logged in"})

            const {username, money} = req.body

            await userModel.findOneAndUpdate({username: username}, {$set: {money: money}})

            return res.send({error: false, data: "User update successful"})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const response = await userModel.find({})

            return res.send({error: false, data: response})
        }

        catch (error) {
            return res.send({error: true, data: error})
        }
    },

    deleteAuction: async (req, res) =>
    {
        if(!req.session.username)
            return res.send({error: true, data: "Not logged in"})

        console.log(req.body._id)

        await auctionsModel.findOneAndDelete({_id: req.body._id}, {new: true})

        let response = await getAuctions(true)

        if(req.body.myAuctions)
        {
            const userAuctions = response.filter((x, index) => x.username === req.session.username)
            response = userAuctions
        }

        return res.send({error: false, data: response})
    }
}