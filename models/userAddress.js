const mongoose = require("mongoose")
const validator = require("validator");

const userAddressSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    addressLine1 : {
        type : String,
        required : true
    },
    addressLine2 : {
        type : String,
        required : false
    },
    city : {
        type : String,
        required : true,
        trim : true
    },
    country : {
        type : String,
        required : true,
        trim : true
    },
    district : {
        type : String,
        required : true,
        trim : true
    },
    semt : {
        type : String,
        required : true,
        trim : true,
    },
    postalCode : {
        type : String,
        required : true,
        trim : true
    },
    phoneNumber : {
        type : String,
        required : true,
        trim : true,
        validate: {
            validator: value => /^\d{11}$/.test(value), // Türkiye telefon numarası kontrolü
            message: "Geçersiz Numara"
        }
    },
})

module.exports = mongoose.model("UserAddress",userAddressSchema)