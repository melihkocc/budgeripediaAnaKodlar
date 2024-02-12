const express = require("express")
const router = express.Router()

const pagesController = require("../controllers/pages")

const productStatusEngelleme = require("../middlewares/product/statusEngelleme")
const categoryStatusEngelleme = require("../middlewares/category/statusEngelleme")
const subCategoryEngelleme = require("../middlewares/subCategory/statusEngelleme")
const csrf = require("../middlewares/account/csrf")
router.get("/",csrf,pagesController.getIndex)

/// single Product
router.get("/product/:productid",csrf,productStatusEngelleme,pagesController.getSingleProduct)

/// Category sayfası içinde subCategory ve productsları var
router.all("/category/:categoryid",csrf,categoryStatusEngelleme,pagesController.getSingleCategory)


/// SubCategory sayfası içinde productsları var
router.get("/sub-category/:categoryid/:subCategoryid",csrf,subCategoryEngelleme,pagesController.getSingleSubCategory)
module.exports = router