const User = require("../models/user")
const bcrypt = require("bcrypt")
const Cart = require("../models/cart")

exports.getRegister = (req,res,next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render("account/register",{
        errorMessage : errorMessage
    })
}

exports.postRegister = async (req,res,next) => {
    try {
        
        const name = req.body.name
        const lastName = req.body.lastName
        const email = req.body.email
        const password = req.body.password
        const passwordTekrar = req.body.passwordTekrar

        const user = await User.findOne({email:email})

        if(user){
            req.session.errorMessage = "Bu emaile sahip bir kullanıcı var. Lütfen başka bir email kullanın!";
            await req.session.save();
            return res.redirect("/register")
        }
        if(password != passwordTekrar){
            req.session.errorMessage = "Şifreler birbirine eşit değil. Lütfen Tekrar deneyiniz!";
            await req.session.save();
            return res.redirect("/register")
        }

        const hashedPassword = await bcrypt.hash(password,10)

        if(!hashedPassword){
            throw new Error("Password hashing failed!")
        }

        const newUser = new User({
            name : name,
            lastName : lastName,
            email : email,
            password : hashedPassword
        })
        await newUser.save()
        return res.redirect("/login")
    } catch (error) {
        console.log(error)
    }
}



exports.getLogin = (req,res,next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render("account/login",{
        errorMessage : errorMessage
    })
}

exports.postLogin = async (req,res,next) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.findOne({email:email})

        if(!user){
            req.session.errorMessage = "Bu emaile sahip kullanıcı bulunamadı!"
            await req.session.save();
            return res.redirect("/login")
        }

        const isSuccess = await bcrypt.compare(password,user.password)

        if(isSuccess){
            req.session.user = user;
            req.session.isAuthenticated = true;
            await req.session.save();
            return res.redirect("/")
        }
        else{
            req.session.errorMessage = "Hatalı Parola!";
            await req.session.save()
            res.redirect("/login")
        }        
    } catch (error) {
        console.log(error)
    }
}

exports.getLogout = async (req,res,next) => {

    Cart.deleteOne({user : req.user._id})
        .then(()=>{
            req.session.destroy((err=>{
                if(err){
                    console.log(err)
                }
                return res.redirect("/")
            }))
        })
        .catch(err=>console.log(err))
}