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

        let sortOptions = {};

        switch (query) {
            case '1':
                // Ürünleri adlarına göre A-Z sırala
                sortOptions = { name: 1 };
                break;
            case '2':
                // Ürünleri adlarına göre Z-A sırala
                sortOptions = { name: -1 };
                break;
            case '3':
                // Ürünleri tarihlerine göre yeni-eski sırala
                sortOptions = { date: -1 };
                break;
            case '4':
                // Ürünleri tarihlerine göre eski-yeni sırala
                sortOptions = { date: 1 };
                break;
            case '5':
                // Ürünleri fiyatlarına göre düşük-yüksek sırala
                sortOptions = { price: 1 };
                break;
            case '6':
                // Ürünleri fiyatlarına göre yüksek-düşük sırala
                sortOptions = { price: -1 };
                break;
            case '7':
                // Ek özel sıralama kriterleri için gerekli işlemleri yap
                // Örneğin, bir özel sıralama kriteri belirlemek istiyorsanız burada işlemleri ekleyebilirsiniz.
                break;
            default:
                // Varsayılan durum için sıralama yapma
                break;
        }

        const options = {
            page: parseInt(req.query.page) || 1,
            limit: 2, // Sayfa başına kaç ürün gösterileceği
            sort: sortOptions
        };

        const result = await Product.paginate({ categories: { $in: subCategoriesIds } }, options);

        res.render("pages/singleCategory.pug", {
            category,
            subCategories,
            products: result.docs,
            currentPage: result.page,
            totalPages: result.totalPages
        });
    } catch (error) {
        console.error("Hata oluştu:", error);
        res.status(500).send('Internal Server Error');
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

    let sortOptions = {};

    switch (query) {
        case '1':
            // Ürünleri adlarına göre A-Z sırala
            sortOptions = { name: 1 };
            break;
        case '2':
            // Ürünleri adlarına göre Z-A sırala
            sortOptions = { name: -1 };
            break;
        case '3':
            // Ürünleri tarihlerine göre yeni-eski sırala
            sortOptions = { date: -1 };
            break;
        case '4':
            // Ürünleri tarihlerine göre eski-yeni sırala
            sortOptions = { date: 1 };
            break;
        case '5':
            // Ürünleri fiyatlarına göre düşük-yüksek sırala
            sortOptions = { price: 1 };
            break;
        case '6':
            // Ürünleri fiyatlarına göre yüksek-düşük sırala
            sortOptions = { price: -1 };
            break;
        case '7':
            // Ek özel sıralama kriterleri için gerekli işlemleri yap
            // Örneğin, bir özel sıralama kriteri belirlemek istiyorsanız burada işlemleri ekleyebilirsiniz.
            break;
        default:
            // Varsayılan durum için sıralama yapma
            break;
    }

        const options = {
            page: parseInt(req.query.page) || 1,
            limit: 2, // Sayfa başına kaç ürün gösterileceği
            sort: sortOptions
        };

        const result = await Product.paginate({ categories: { $in: subCategory._id } }, options);



    res.render("pages/singleSubCategory",{
        category : category,
        subCategories : subCategories,
        subCategory : subCategory,
        products: result.docs,
        currentPage: result.page,
        totalPages: result.totalPages
    })

}