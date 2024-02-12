const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
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
    date:{
        type : Date,
        default : Date.now
    },
    totalPrice : {
        type : Number,
        required : true
    },
    cancellation : {
        type : Boolean,
    },
    status : {
        type : String,
        required : true,
        enum : ["Onay Bekliyor", "Kargoya Verildi", "Teslim Edildi","Sipariş İptal Edildi"],
        default : "Onay Bekliyor"
    },
    paymentMethod : {
        type : String,
        required : true,
        enum : ["Kapıda Ödeme","Kredi Kartı"],
        default : ""
    },
    address : {
        type : mongoose.Schema.ObjectId,
        ref : "UserAddress",
        required : true
    }

})

module.exports = mongoose.model("Order",orderSchema)