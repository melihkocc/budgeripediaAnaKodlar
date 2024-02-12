const Product = require("../../models/product")
module.exports = async (req,res,next)=>{
    const product = await Product.findById(req.params.productid)
    if(!product.status){
        return res.redirect("/")
    }
    next()
}