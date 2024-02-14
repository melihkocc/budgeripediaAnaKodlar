const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")

const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    price : {
        type : Number,
        required : true
    },
    salePrice : {
        type : Number,
        required : false
    },
    description : {
        type : String,
        required : true
    },
    date : {
        type:Date,
        default: Date.now,
    },
    categories : [{
        type : mongoose.Schema.ObjectId,
        ref : "SubCategory",
        required : true
    }],
    status : {
        type : Boolean,
        default : false
    },
    url : {
        type : String,
        default : "",
        required : true
    },
    image_id : {
        type : String,
        default : "",
        required : true
    }
})

productSchema.plugin(paginate)


module.exports = mongoose.model("Product",productSchema)