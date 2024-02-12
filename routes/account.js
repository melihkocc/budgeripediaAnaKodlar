const express = require("express");
const router = express.Router();

const accountController = require("../controllers/account")
const csrfToken = require("../middlewares/account/csrf")
const loginRegisterEngelleme = require("../middlewares/account/loginRegisterEngelleme")

router.get("/register",loginRegisterEngelleme,csrfToken,accountController.getRegister)
router.post("/register",loginRegisterEngelleme,csrfToken,accountController.postRegister)

router.get("/login",loginRegisterEngelleme,csrfToken,accountController.getLogin)
router.post("/login",loginRegisterEngelleme,csrfToken,accountController.postLogin)

router.get("/logout",accountController.getLogout)

module.exports = router