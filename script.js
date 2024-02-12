const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const csurf = require("csurf")    /// csrf token
const bodyParser = require("body-parser");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const fileUpload = require("express-fileupload");
const User = require("./models/user")
const cloudinary = require("cloudinary").v2

const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;


////cloudinary 
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET 
})


/// pug kurulum START
app.set("view engine","pug");
app.set("views","./views")
/// pug kurulum END


//// session

var store = new mongodbStore({
    uri : `mongodb+srv://${databaseUser}:${databasePassword}@cluster0.mfvmito.mongodb.net/`,
    collection : "mySessions"
})

app.use(session({
    secret : "keyboard cat",
    resave : false,
    saveUninitialized : false,
    store : store,
    cookie : {maxAge : 3*60*60*1000}        /// 3 saat sonra bitecek authentication
}))
app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    try {
        const user = await User.findById(req.session.user._id);

        if (user) {
            req.user = user;
        }

        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
});
//// session End


//////
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:false}));
app.use(fileUpload({useTempFiles:true}))
//////

app.use(csurf())  // csrf token /// yeri çok önemli yoksa çalışmaz


///// categoriesleri her yere gönderme
const { addCategoriesLocals } = require("./middlewares/category/getCategories")
app.use(addCategoriesLocals)
/////



//// Rotues

const sendAuthenticated = require("./middlewares/account/sendAuthenticated")
const isAdmin = require("./middlewares/account/isAdmin")

const pagesRoute = require("./routes/pages")
app.use("/",sendAuthenticated,pagesRoute)

const accountRoute = require("./routes/account");
app.use("/",sendAuthenticated,accountRoute)

const adminRoute = require("./routes/admin")
app.use("/admin",sendAuthenticated,isAdmin,adminRoute)

const cartRoute = require("./routes/cart")
app.use("/cart",sendAuthenticated,cartRoute)

const userAddressRoute = require("./routes/userAddress")
app.use("/address",sendAuthenticated,userAddressRoute)

const paymentRoute = require("./routes/payment")
app.use("/payment",sendAuthenticated,paymentRoute)

const errorController = require("./controllers/error")
app.use("/",errorController.error_404)
//// Routes End



const port = process.env.PORT || 3000;

mongoose.connect(`mongodb+srv://${databaseUser}:${databasePassword}@cluster0.mfvmito.mongodb.net/`)
    .then(()=>{
        console.log("Connected")
        app.listen(port)
    })
    .catch(err=>console.log(err))
