const Category = require("../../models/category")
module.exports = async (req,res,next)=>{
    const category = await Category.findById(req.params.categoryid)
    if(!category.status){
        return res.redirect("/")
    }
    next()
}