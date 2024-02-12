const Cart = require("../../models/cart");

module.exports = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart || cart.products.items.length === 0) {
            return res.redirect("/cart");
        }

        // Eğer sepette ürün varsa ve diğer koşullar sağlanıyorsa devam et
        next();
    } catch (error) {
        console.error("Sepet bilgileri alınamadı:", error);
    }
};
