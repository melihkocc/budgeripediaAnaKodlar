const Category = require("../models/category")
const SubCategory = require("../models/subCategory")

exports.getAdmin = (req,res,next) => {
    res.render("admin/admin")
}

exports.getAddCategory = (req,res,next) => {
    var errorMessage = req.session.errorMessage
    delete req.session.errorMessage
    res.render("admin/addCategory",{
        errorMessage : errorMessage
    })
}

exports.postAddCategory = async (req,res,next) => {
    const categoryName = req.body.category
    const status = req.body.status
    
    if(!categoryName){
        req.session.errorMessage = "Lütfen Kategori İsmi Alanını Boş Bırakmayınız !";
        await req.session.save();
        return res.redirect("/admin/add-category")
    }

    if(status){
        const category = new Category({
            name : categoryName,
            status : true
        })
        await category.save()
        return res.redirect("/admin/categories")
    }
    else{
        const category = new Category({
            name : categoryName,
            status : false
        })
        await category.save()
        return res.redirect("/admin/categories")
    }

}


exports.getCategories = async (req,res,next) => {

    const categories = await Category.find().sort({name : 1})
    res.render("admin/categories",{
        categories : categories
    })

}

exports.getEditCategory = async (req,res,next) => {
    const categoryid = req.params.categoryid
    const category = await Category.findOne({_id:categoryid})

    var errorMessage = req.session.errorMessage
    delete req.session.errorMessage

    res.render("admin/editCategory",{
        category: category,
        errorMessage : errorMessage
    })
}


exports.postEditCategory = async (req,res,next) => {
    const categoryid = req.body.categoryid
    const categoryName = req.body.category
    const status = req.body.status

    const category = await Category.findOne({_id : categoryid})

    if(!categoryName){
        req.session.errorMessage = "Lütfen Kategori İsmi Alanını Boş Bırakmayınız!";
        await req.session.save()
        return res.redirect(`/admin/edit-category/${categoryid}`)
    }
    category.name = categoryName
    if(status){
        category.status = true
        await category.save()
        return res.redirect("/admin/categories")
    }
    else{
        category.status = false
        await category.save()
        return res.redirect("/admin/categories")
    }
}


exports.getDeleteCategory = (req,res,next) => {
    const categoryid = req.params.categoryid

    Category.deleteOne({_id : categoryid})
        .then(()=>{
            res.redirect("/admin/categories")
        })
        .catch(err=>console.log(err))
}

///////////////////////////////////////////////////////////////////////////////// CATEGORY BİTTİ  ÜST CATEGORY  ALT SUBCategory

exports.getAddSubCategory = async (req,res,next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    const categories = await Category.find()
    res.render("admin/addSubCategory",{
        errorMessage:errorMessage,
        categories:categories
    })
}

exports.postAddSubCategory = async (req,res,next) => {
    const subCategoryName = req.body.category
    const status = req.body.status
    const ustCategory = req.body.ustCategory

    if(!subCategoryName || !ustCategory){
        req.session.errorMessage = "Lütfen Kategori İsmi ve Üst Kategori Alanlarını Doldurunuz!";
        await req.session.save()
        return res.redirect("/admin/add-subCategory");
    }

    if(status){
        const subCategory = new SubCategory({
            name : subCategoryName,
            status : true,
            topCategory : ustCategory
        })
        await subCategory.save()
        return res.redirect("/admin/subCategories")
    }
    else{
        const subCategory = new SubCategory({
            name : subCategoryName,
            status : true,
            topCategory : ustCategory
        })
        await subCategory.save()
        return res.redirect("/admin/subCategories")
    }
}

exports.getSubCategories = async (req,res,next) => {
    const subCategories = await SubCategory.find().sort({topCategory : 1}).populate("topCategory")
    res.render("admin/subCategories",{
        subCategories:subCategories
    })
}

exports.getEditSubCategory = async (req,res,next) => {
    const subCategoryid = req.params.subCategoryid
    var errorMessage = req.session.errorMessage
    delete req.session.errorMessage
    const subCategory = await SubCategory.findOne({_id : subCategoryid})
    const categories = await Category.find()
    res.render("admin/editSubCategory",{
        subCategory : subCategory,
        categories:categories,
        errorMessage:errorMessage
    })
}

exports.postEditSubCategory = async (req,res,next) => {
    const subCategoryid = req.body.subCategoryid
    const subCategoryName = req.body.category
    const status = req.body.status
    const ustCategory = req.body.ustCategory

    const subCategory = await SubCategory.findOne({_id : subCategoryid})

    if(!subCategoryName || !ustCategory){
        req.session.errorMessage = "Lütfen Kategori İsmi ve Üst Kategori Alanlarını Doldurunuz!"
        await req.session.save();
        return res.redirect(`/admin/edit-subCategory/${subCategoryid}`)
    }

    subCategory.name = subCategoryName
    if(status){
        subCategory.status = true
        subCategory.topCategory = ustCategory
        await subCategory.save()
        return res.redirect("/admin/subCategories")
    }
    else{
        subCategory.status = false
        subCategory.topCategory = ustCategory
        await subCategory.save()
        return res.redirect("/admin/subCategories")
    }
}


exports.getDeleteSubCategory = (req,res,next) => {
    const subCategoryid = req.params.subCategoryid

    SubCategory.deleteOne({_id : subCategoryid})
        .then(()=>{
            res.redirect("/admin/subCategories")
        })
        .catch(err=>console.log(err))
}

///////////////////////////////////////////////////////////////////////////////// SUBCATEGORY BİTTİ  ÜST SUBCATEGORY  ALT PRODUCT
const cloudinary = require("cloudinary").v2
const fs = require("fs")
const Product = require("../models/product")

exports.getAddProduct = async (req,res,next) => {
    var errorMessage = req.session.errorMessage
    delete req.session.errorMessage
    const subCategories = await SubCategory.find()

    res.render("admin/addProduct",{
        errorMessage : errorMessage,
        subCategories : subCategories
    })

}

exports.postAddProduct = async (req,res,next) => {
    const name = req.body.name
    const price = req.body.price
    const description = req.body.description
    const status = req.body.status
    const categoryids = req.body.categoryids

    try {
        
        if(!name || !price || !description){
            req.session.errorMessage = "Lütfen Tüm Alanları Doldurunuz!";
            await req.session.save()
            return res.redirect("/admin/add-product")
        }
        if(!categoryids){
            req.session.errorMessage = "Lütfen Ürüne En Az Bir Kategori Seçin!";
            await req.session.save()
            return res.redirect("/admin/add-product")
        }
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
            use_filename : true,
            folder : "productResim"
        })

        const product = new Product({
            name : name,
            price : price,
            description : description,
            categories : categoryids,
            status : status ? true : false,
            url : result.secure_url,
            image_id : result.public_id
        })

        product.save()
            .then(()=>{
                fs.unlink(req.files.image.tempFilePath,(err)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.redirect("/admin/admin")
                    }
                })
            })

    } catch (error) {
        console.log(error)
        next(error)
    }
}


exports.getProducts = async (req,res,next) => {

    const products = await Product.find().sort({price : 1}).populate("categories")

    res.render("admin/products",{
        products : products
    })

}


exports.getEditProduct = async (req,res,next) => {

    var errorMessage = req.session.errorMessage
    delete req.session.errorMessage
    const productid = req.params.productid
    const product = await Product.findById(productid)
    const categories = await SubCategory.find()
    res.render("admin/editProduct",{
        product : product,
        categories : categories, 
        errorMessage : errorMessage
    })


}


exports.postEditProduct = async (req, res, next) => {
    try {
        const productid = req.body.productid;
        const product = await Product.findById(productid);

        const name = req.body.name;
        const price = req.body.price;
        const salePrice = req.body.salePrice
        const description = req.body.description;
        const status = req.body.status;
        const categoryids = req.body.categoryids;

        if (!name || !price || !description) {
            req.session.errorMessage = "Lütfen Tüm Alanları Doldurunuz!";
            await req.session.save();
            return res.redirect(`/admin/edit-product/${productid}`);
        }

        if (!categoryids) {
            req.session.errorMessage = "Lütfen Ürüne En Az Bir Kategori Seçin!";
            await req.session.save();
            return res.redirect(`/admin/edit-product/${productid}`);
        }

        if (req.files) {
            if (product.image_id) {
                await cloudinary.uploader.destroy(product.image_id);
            }

            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
                use_filename: true,
                folder: "productResim",
            });

            product.url = result.secure_url;
            product.image_id = result.public_id;

            fs.unlink(req.files.image.tempFilePath,(err)=>{
                if(err){
                    console.log(err)
                }
            })
        }

        product.name = name;
        product.price = price;
        product.salePrice = salePrice;
        product.description = description;
        product.categories = categoryids;

        if (status) {
            product.status = true;
        } else {
            product.status = false;
        }

        await product.save();
        return res.redirect("/admin/products");
    } catch (err) {
        console.error(err);
    }
};

exports.getDeleteProduct = async (req,res,next) => {

    const productid = req.params.productid
    const product = await Product.findById(productid)

    await cloudinary.uploader.destroy(product.image_id)
    await Product.deleteOne({_id : productid})

    return res.redirect("/admin/products")

}