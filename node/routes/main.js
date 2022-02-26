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

// router.get("/info", sessionTest)
// router.post("/set-image", addImage)
// router.post("/delete-image", deleteImage)
// router.post("/post-request", middle.checkPostData, postData)
// router.post("/delete-post", deletePost)
// router.post("/update-post", middle.checkPostData, updatePost)
// router.get("/post/:postId", getSinglePost)
// router.get("/user-posts/:username", getUserPosts)
// router.get("/ali-get-product/:productID", getProductData)
// router.post("/add-car", middle.checkCarData, saveCarData)
// router.post("/find-car", findCar)
// router.post("/update-car", middle.checkCarData, updateCarData)
// router.delete("/delete-car/:id", deleteCarData)
// router.post("/update-money", updateCasinoMoney)
//
// router.post("/get-all-users", getAllUsers)
// router.post("/get-all-posts", getAllPosts)
// router.post("/get-single-post", getSinglePostData)
// router.post("/get-user-data/", getUserData)
// router.post("/set-user-photo/", middle.validateUserPhoto, setUserPhoto)
// router.post("/post-comment/", middle.validateComment, postComment)
// router.delete("/delete-user/:id", deleteUser)

module.exports = router