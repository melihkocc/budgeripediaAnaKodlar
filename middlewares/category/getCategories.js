const Category = require("../../models/category")


const addCategoriesLocals = async (req,res,next) => {
    try {
        const categories = await Category.find();
        res.locals.categories = categories;
        next();
    } catch (error) {
        console.log(error)
    }
}

module.exports = { addCategoriesLocals };