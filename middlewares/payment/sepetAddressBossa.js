const Cart = require("../../models/cart");
const User = require("../../models/user")

module.exports = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        const user = await User.findById(req.user._id)
        const userSelectedAddress = user.selectedAddress
        if (!cart || cart.products.items.length === 0 || !userSelectedAddress) {
            return res.redirect("/cart");
        }

        // Eğer sepette ürün varsa ve diğer koşullar sağlanıyorsa devam et
        next();
    } catch (error) {
        console.error("Sepet bilgileri alınamadı:", error);
    }
};
