const express = require("express")
const router = express.Router()

const userAddressControllers = require("../controllers/userAddress")
const csrf = require("../middlewares/account/csrf")
const sepetBossa = require("../middlewares/userAddress/sepetBossa")
const loginEngelleme = require("../middlewares/account/loginEngelleme")


router.get("/address",csrf,loginEngelleme,sepetBossa,userAddressControllers.getUserAddress)
router.post("/address",csrf,loginEngelleme,sepetBossa,userAddressControllers.postUserAddress)

router.get("/edit-address/:userAddressid",csrf,loginEngelleme,userAddressControllers.getEditUserAddress)
router.post("/edit-address",csrf,loginEngelleme,userAddressControllers.postEditUserAddress)
router.get("/delete-address/:userAddressid",csrf,loginEngelleme,userAddressControllers.getDeleteUserAddress)
router.get("/add-address",csrf,loginEngelleme,userAddressControllers.getAddUserAddress)
router.post("/add-address",csrf,loginEngelleme,userAddressControllers.postAddUserAddress)

/// select address
router.post("/select-address",csrf,loginEngelleme,sepetBossa,userAddressControllers.postSelectUserAddress)

module.exports = router;