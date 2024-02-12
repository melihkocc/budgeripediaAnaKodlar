const mongoose = require("mongoose")
const {isEmail} = require("validator")

const userSchema = mongoose.Schema({

    name : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        validate : [isEmail,"Geçersiz Email"],
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    resetToken : String,
    resetTokenExpiration : String,
    isAdmin : {
        type : Boolean,
        default : false,
    },
    date : {
        type : Date,
        default : Date.now,
    },
    address : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "UserAddress",
            required : false
        }
    ],
    selectedAddress : {
        type : mongoose.Schema.ObjectId,
        ref : "UserAddress",
        required : false
    }
})


module.exports = mongoose.model("User",userSchema)