const express = require("express")
const router = express.Router()

const paymentController = require("../controllers/payment")
const sepetAddressBossa = require("../middlewares/payment/sepetAddressBossa")
const csrf = require("../middlewares/account/csrf")
const loginEngelleme = require("../middlewares/account/loginEngelleme")

router.get("/",loginEngelleme,csrf,sepetAddressBossa,paymentController.getPayment)
router.post("/",loginEngelleme,csrf,sepetAddressBossa,paymentController.postPayment)

module.exports = router