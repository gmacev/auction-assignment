const express = require('express')
const router = express.Router()
const {
    registerUser,
    login,
    logOut,
    postAuction,
    postBid,
    getAllAuctions,
    getAllBids,
    getSingleAuctionData,
    getUserData,
    getAllUsers,
    deleteAuction,
    updateUser,
    getUserAuctions,
    getUserBids
} = require('../controllers/main')

const middle = require("../middleware/main")

router.post("/register-user/", middle.validateUserRegister, registerUser)
router.post("/login", middle.validateUserLogin, login)
router.post("/logout", logOut)
router.post("/post-auction", middle.checkAuctionData, postAuction)
router.post("/post-bid/", middle.validateBid, postBid)
router.post("/get-all-auctions", getAllAuctions)
router.post("/get-all-bids", getAllBids)
router.post("/get-single-auction", getSingleAuctionData)
router.post("/get-user-data/", getUserData)
router.post("/update-user", updateUser)
router.post("/get-all-users", getAllUsers)
router.post("/delete-auction", deleteAuction)
router.post("/get-user-auctions", getUserAuctions)
router.post("/get-user-bids", getUserBids)

module.exports = router