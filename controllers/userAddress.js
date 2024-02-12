const User = require("../models/user");
const Cart = require("../models/cart")
const UserAddress = require("../models/userAddress")
exports.getUserAddress = async (req, res, next) => {
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    try {
        const user = await User.findById(req.user._id);

        const cart = await Cart.findOne({ user: req.user._id }).populate({
            path: 'products.items.productId',
            model: 'Product'  // Product modelini ekleyin ve yolunuzu düzeltin
        });

        const userAddresses = await UserAddress.find({user : user._id}).populate("user")
        if (user.address.length > 0) {
            return res.render("address/varAddress", { errorMessage,cart,userAddresses });
        } else {
            return res.render("address/yokAddress", { errorMessage,cart });
        }
    } catch (error) {
        console.error("Kullanıcı adres bilgileri alınamadı:", error);
    }
};

exports.postUserAddress = async (req,res,next) => {
    const country = req.body.country
    const city = req.body.city
    const addressLine1 = req.body.addressLine1
    const addressLine2 = req.body.addressLine2
    const district = req.body.district
    const semt = req.body.semt
    const phoneNumber = req.body.phoneNumber
    const postalCode = req.body.postalCode

    const user = await User.findById(req.user._id)

    if(!country || !city || !addressLine1 || !district || !semt || !phoneNumber || !postalCode){
        req.session.errorMessage = "Lütfen Tüm Gerekli Alanları (*) Doldurunuz !";
        await req.session.save();
        return res.redirect("/address/address")
    }
    const userAddress = new UserAddress({
        user : req.user._id,
        addressLine1 : addressLine1,
        addressLine2 : addressLine2,
        city : city,
        country : country,
        district : district,
        semt : semt,
        postalCode : postalCode,
        phoneNumber : phoneNumber
    })
    await userAddress.save()
    user.address = userAddress;
    user.selectedAddress = userAddress._id;
    await user.save()
    return res.redirect("/payment")
}

exports.getEditUserAddress = async (req,res,next) => {
    const userAddressid = req.params.userAddressid
    const userAddress = await UserAddress.findById(userAddressid)
    var errorMessage = req.session.errorMessage
    delete req.session.errorMessage
    res.render("address/editAddress",{
        userAddress,
        errorMessage
    })
}

exports.postEditUserAddress = async (req,res,next) => {
    const userAddressid = req.body.userAddressid
    const addressLine1 = req.body.addressLine1
    const addressLine2 = req.body.addressLine2
    const city = req.body.city
    const country = req.body.country
    const district = req.body.district
    const semt = req.body.semt
    const postalCode = req.body.postalCode
    const phoneNumber = req.body.phoneNumber
    
    if(!country || !city || !addressLine1 || !district || !semt || !phoneNumber || !postalCode){
        req.session.errorMessage = "Lütfen Tüm Gerekli Alanları (*) Doldurunuz !";
        await req.session.save();
        return res.redirect("/address/address")
    }
    const userAddress = await UserAddress.findById(userAddressid)
    userAddress.addressLine1 = addressLine1
    userAddress.addressLine2 = addressLine2
    userAddress.city = city
    userAddress.country = country
    userAddress.district = district
    userAddress.semt = semt
    userAddress.postalCode = postalCode
    userAddress.phoneNumber = phoneNumber
    await userAddress.save()
    return res.redirect("/address/address")
}

exports.getDeleteUserAddress = async (req,res,next) => {
    const userAddressid = req.params.userAddressid
    UserAddress.deleteOne({_id : userAddressid})
        .then(()=>{
            res.redirect("/address/address")
        })
        .catch(err=>console.log(err))
}

exports.getAddUserAddress = async (req,res,next) => {
    var errorMessage = req.session.errorMessage
    delete req.session.errorMessage
    res.render("address/addAddress",{errorMessage})
}

exports.postAddUserAddress = async (req,res,next) => {
    const user = req.user._id
    const addressLine1 = req.body.addressLine1
    const addressLine2 = req.body.addressLine2
    const city = req.body.city
    const country = req.body.country
    const district = req.body.district
    const semt = req.body.semt
    const postalCode = req.body.postalCode
    const phoneNumber = req.body.phoneNumber

    const userAddress = new UserAddress({
        user : user,
        addressLine1 : addressLine1,
        addressLine2 : addressLine2,
        city : city,
        country : country,
        district : district,
        semt : semt,
        postalCode : postalCode,
        phoneNumber : phoneNumber
    })
    await userAddress.save()
    return res.redirect("/address/address")

}

exports.postSelectUserAddress = async (req,res,next) => {
    const selectUserAddress = req.body.selectUserAddress
    const user = await User.findById(req.user._id)
    user.selectedAddress = selectUserAddress
    await user.save();
    return res.redirect("/payment")
}