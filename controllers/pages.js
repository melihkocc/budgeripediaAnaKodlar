const Product = require("../models/product")
const Category = require("../models/category")
const SubCategory = require("../models/subCategory")

exports.getIndex = async (req,res,next) => {

    const lastProducts = await Product.find().sort({date : -1}).limit(7)

    res.render("pages/anasayfa",{
        lastProducts : lastProducts
    })
}


exports.getSingleProduct = async (req,res,next) => {
    const productid = req.params.productid
    const product = await Product.findById(productid)
    res.render("pages/singleProduct",{
        product:product
    })
}


exports.getSingleCategory = async (req, res, next) => {
    try {
        const categoryid = req.params.categoryid;
        const category = await Category.findById(categoryid);
        const subCategories = await SubCategory.find({ topCategory: categoryid });

        const subCategoriesIds = subCategories.map(subCategory => subCategory._id);

        const query = req.body.query;
        let products;

        switch (query) {
            case '1':
                // Ürünleri adlarına göre A-Z sırala
                products = await Product.find({ categories: { $in: subCategoriesIds } }).sort({ name: 1 });
                break;
            case '2':
                // Ürünleri adlarına göre Z-A sırala
                products = await Product.find({ categories: { $in: subCategoriesIds } }).sort({ name: -1 });
                break;
            case '3':
                // Ürünleri tarihlerine göre yeni-eski sırala
                products = await Product.find({ categories: { $in: subCategoriesIds } }).sort({ date: -1 });
                break;
            case '4':
                // Ürünleri tarihlerine göre eski-yeni sırala
                products = await Product.find({ categories: { $in: subCategoriesIds } }).sort({ date: 1 });
                break;
            case '5':
                // Ürünleri fiyatlarına göre düşük-yüksek sırala
                products = await Product.find({ categories: { $in: subCategoriesIds } }).sort({ price: 1 });
                break;
            case '6':
                // Ürünleri fiyatlarına göre yüksek-düşük sırala
                products = await Product.find({ categories: { $in: subCategoriesIds } }).sort({ price: -1 });
                break;
            case '7':
                // Ek özel sıralama kriterleri için gerekli işlemleri yap
                products = await Product.find({ categories: { $in: subCategoriesIds } });
                break;
            default:
                // Varsayılan durum için sıralama yapma
                products = await Product.find({ categories: { $in: subCategoriesIds } });
                break;
        }

        res.render("pages/singleCategory.pug", {
            category,
            subCategories,
            products
        });
    } catch (error) {
        console.error("Hata oluştu:", error);
    }
};




exports.getSingleSubCategory = async (req,res,next) => {
    const categoryid = req.params.categoryid
    const subCategoryid = req.params.subCategoryid

    const category = await Category.findById(categoryid)
    const subCategories = await SubCategory.find({topCategory : category._id})
    const subCategory = await SubCategory.findById(subCategoryid)

    const query = req.body.query
    let products;


        switch (query) {
            case '1':
                // Ürünleri adlarına göre A-Z sırala
                products = await Product.find({categories : subCategory._id}).sort({ name: 1 });
                break;
            case '2':
                // Ürünleri adlarına göre Z-A sırala
                products = await Product.find({categories : subCategory._id}).sort({ name: -1 });
                break;
            case '3':
                // Ürünleri tarihlerine göre yeni-eski sırala
                products = await Product.find({categories : subCategory._id}).sort({ date: -1 });
                break;
            case '4':
                // Ürünleri tarihlerine göre eski-yeni sırala
                products = await Product.find({categories : subCategory._id}).sort({ date: 1 });
                break;
            case '5':
                // Ürünleri fiyatlarına göre düşük-yüksek sırala
                products = await Product.find({categories : subCategory._id}).sort({ price: 1 });
                break;
            case '6':
                // Ürünleri fiyatlarına göre yüksek-düşük sırala
                products = await Product.find({categories : subCategory._id}).sort({ price: -1 });
                break;
            case '7':
                // Ek özel sıralama kriterleri için gerekli işlemleri yap
                products = await Product.find({categories : subCategory._id});
                break;
            default:
                // Varsayılan durum için sıralama yapma
                products = await Product.find({categories : subCategory._id});
                break;
        }

    res.render("pages/singleSubCategory",{
        category : category,
        subCategories : subCategories,
        subCategory : subCategory,
        products : products
    })

}