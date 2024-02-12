const mongoose = require("mongoose")

const cartSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    products : {
        items:[
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product",
                required : true
            },
            quantity : {
                type : Number,
                required : true
            }
        }]
    },
    date : {
        type : Date,
        default : Date.now,
    }
})

module.exports = mongoose.model("Cart",cartSchema)