const Cart = require("../models/cart");
const Product = require("../models/product")
const User = require("../models/user")

exports.getCartPage = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            res.render("cart/cart",{
                bos : true
            })
        }
        else{

            const products = []
            for (const item of cart.products.items) {
                const product = await Product.findById(item.productId)
                products.push({product:product,quantity:item.quantity})
            }

            res.render("cart/cart",{
                cart : cart,
                products: products
            })
        }
        

    } catch (error) {
        console.error("Hata:", error);
    }
};


exports.postAddToCart = async (req, res, next) => {
    try {
        const quantity = Number(req.body.quantity);
        const productId = req.body.productid;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: { items: [] } });
        }

        const product = await Product.findById(productId);

        const existingProductIndex = cart.products.items.findIndex(item => item.productId.toString() === productId.toString());

        if (existingProductIndex !== -1) {
            cart.products.items[existingProductIndex].quantity += quantity;
        } else {
            cart.products.items.push({ productId, quantity });
        }

        await cart.save();

        return res.redirect("/cart");
    } catch (error) {
        console.error("Hata:", error);
        return res.status(500).json({ error: "Bir hata oluştu." });
    }
};



exports.postRemoveFromCart = async (req, res, next) => {
    try {
        const productId = req.body.productid;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(400).json({ error: "Sepet bulunamadı." });
        }

        // Sepetten çıkarılmak istenen ürünün index'ini bul
        const productIndex = cart.products.items.findIndex(item => item.productId.toString() === productId.toString());

        if (productIndex === -1) {
            return res.status(400).json({ error: "Ürün sepetinizde bulunamadı." });
        }

        cart.products.items.splice(productIndex, 1);

        await cart.save();

        return res.redirect("/cart");
    } catch (error) {
        console.error("Hata:", error);
    }
};

exports.postBuy = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({user : req.user._id})
        for (let index = 0; index < cart.products.items.length; index++) {
            cart.products.items[index].quantity = req.body.products.products[index].quantity 
        }
        await cart.save()
        res.redirect("/address/address")
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
