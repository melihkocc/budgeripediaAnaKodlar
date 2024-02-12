const SubCategory = require("../../models/subCategory")
module.exports = async (req,res,next)=>{
    const subCategory = await SubCategory.findById(req.params.subCategoryid)
    if(!subCategory.status){
        return res.redirect("/")
    }
    next()
}