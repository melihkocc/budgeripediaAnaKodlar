const mongoose = require("mongoose")

const subCategorySchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        default : true
    },
    topCategory : {
        type : mongoose.Schema.ObjectId,
        ref : "Category",
        required : true
    }
})

module.exports = mongoose.model("SubCategory",subCategorySchema)