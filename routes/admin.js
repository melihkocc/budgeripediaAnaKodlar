const express = require("express")
const router = express.Router()

const adminContoller = require("../controllers/admin")
const csrf = require("../middlewares/account/csrf")

router.get("/admin",adminContoller.getAdmin)

router.get("/add-category",csrf,adminContoller.getAddCategory)
router.post("/add-category",csrf,adminContoller.postAddCategory)
router.get("/categories",adminContoller.getCategories)

router.get("/edit-category/:categoryid",csrf,adminContoller.getEditCategory)
router.post("/edit-category",csrf,adminContoller.postEditCategory)

router.get("/delete-category/:categoryid",adminContoller.getDeleteCategory)

/////////////////////////////////////////////////////////////////////////////// CATEGORY BİTTİ 


router.get("/add-subcategory",csrf,adminContoller.getAddSubCategory)
router.post("/add-subcategory",csrf,adminContoller.postAddSubCategory)

router.get("/subCategories",adminContoller.getSubCategories)

router.get("/edit-subCategory/:subCategoryid",csrf,adminContoller.getEditSubCategory)
router.post("/edit-subCategory",csrf,adminContoller.postEditSubCategory)

router.get("/delete-subCategory/:subCategoryid",adminContoller.getDeleteSubCategory)


/////////////////////////////////////////////////////////////////////////////// SUBCATEGORY BİTTİ 

router.get("/add-product",csrf,adminContoller.getAddProduct)
router.post("/add-product",csrf,adminContoller.postAddProduct)

router.get("/products",adminContoller.getProducts)

router.get("/edit-product/:productid",csrf,adminContoller.getEditProduct)
router.post("/edit-product",csrf,adminContoller.postEditProduct)

router.get("/delete-product/:productid",adminContoller.getDeleteProduct)


/////////////////////////////////////////////////////////////////////////////// PRODUCT BİTTİ 

module.exports = router
