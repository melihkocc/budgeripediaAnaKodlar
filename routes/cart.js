const express = require("express")
const router = express.Router()

const csrf = require("../middlewares/account/csrf")
const loginEngelleme = require("../middlewares/account/loginEngelleme")
const cartController = require("../controllers/cart")
const sepetBossa = require("../middlewares/userAddress/sepetBossa")

router.get("/",loginEngelleme,csrf,cartController.getCartPage)
router.post("/add-cart",loginEngelleme,csrf,cartController.postAddToCart)

router.post("/remove-product-cart",loginEngelleme,csrf,cartController.postRemoveFromCart)
router.post("/buy",loginEngelleme,sepetBossa,csrf,cartController.postBuy)

module.exports = router