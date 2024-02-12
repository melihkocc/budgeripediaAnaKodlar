const dotenv = require("dotenv")
dotenv.config()
const Iyzipay = require('iyzipay');
const { v4: uuidv4 } = require('uuid');
const Cart = require("../models/cart")
const User = require("../models/user")
const UserAddress = require("../models/userAddress")
const CreditCard = require("../models/creditCard")

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey:process.env.IYZICO_SECRET_KEY,
    uri: 'https://sandbox-api.iyzipay.com'
});

exports.getPayment = async (req,res,next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage

    res.render("payment/paymentPage",{
        errorMessage : errorMessage
    })
    
}

exports.postPayment = async (req, res, next) => {
    const nameSurname = req.body.nameSurname;
    const creditCardNumber = req.body.creditCardNumber;
    const expirationMonth = req.body.expirationMonth;
    const expirationYear = req.body.expirationYear;
    const cvv = req.body.cvv;

    const cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'products.items.productId',
        model: 'Product'  // Product modelini ekleyin ve yolunuzu düzeltin
    });

    const user = await User.findById(req.user._id);
    const selectedAddress = user.selectedAddress;
    const userAddress = await UserAddress.findById(selectedAddress);
    try {
        const randomID = uuidv4();
        let total = 0;
        for (const item of cart.products.items) {
            if (item.productId.salePrice) {
                total += item.productId.salePrice * item.quantity;
            } else {
                total += item.productId.price * item.quantity;
            }
        }
        total = parseFloat(total).toFixed(2)    //// string tipte
        var request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: randomID.toString(),
            price: total.toString(),
            paidPrice: total.toString(),
            currency: Iyzipay.CURRENCY.TRY,
            installment: '1',
            basketId: cart._id.toString(),
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            paymentCard: {
                cardHolderName: nameSurname.toString(),
                cardNumber: creditCardNumber.toString(),
                expireMonth: expirationMonth.toString(),
                expireYear: expirationYear.toString(),
                cvc: cvv.toString(),
                registerCard: '0'
            },
            buyer: {
                id: user._id.toString(),
                name: user.name.toString(),
                surname: user.lastName.toString(),
                gsmNumber: userAddress.phoneNumber.toString(),
                email: user.email.toString(),
                identityNumber: '74300864791',
                lastLoginDate: '2015-10-05 12:43:35',
                registrationDate: '2013-04-21 15:12:09',
                registrationAddress: userAddress.addressLine1.toString(),
                ip: '85.34.78.112',
                city: userAddress.city.toString(),
                country: userAddress.country.toString(),
                zipCode: userAddress.postalCode.toString()
            },
            shippingAddress: {
                contactName: user.name.toString(),
                city: userAddress.city.toString(),
                country: userAddress.country.toString(),
                address: userAddress.addressLine1.toString(),
                zipCode: userAddress.postalCode.toString()
            },
            billingAddress: {
                contactName: user.name.toString(),
                city: userAddress.city.toString(),
                country: userAddress.country.toString(),
                address: userAddress.addressLine1.toString(),
                zipCode: userAddress.postalCode.toString()
            },
            basketItems: []
        };

        for (const item of cart.products.items) {

            if(item.productId.salePrice){
                item.productId.salePrice = parseFloat(item.productId.salePrice).toFixed(2)
                const basketItem = {
                    id: item.productId._id.toString(),
                    name: item.productId.name.toString(),
                    category1: 'Electronics',
                    category2: 'Usb / Cable',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: (item.productId.salePrice * item.quantity)
                };
                request.basketItems.push(basketItem);
            }
            else{
                item.productId.price = parseFloat(item.productId.price).toFixed(2)
                const basketItem = {
                    id: item.productId._id.toString(),
                    name: item.productId.name.toString(),
                    category1: 'Electronics',
                    category2: 'Usb / Cable',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: (item.productId.price * item.quantity)
                };
                request.basketItems.push(basketItem);
            }
        }

        const createPaymentPromise = new Promise((resolve, reject) => {
            iyzipay.payment.create(request, (err, result) => {
                if (err) {
                    reject(err);
                    res.status(400).json({ error: "Payment request failed" });
                } else {
                    resolve(result);
                }
            });
        });

        createPaymentPromise
            .then( async (result) => {
                console.log("Payment Result:", result);
                cart.products.items = [];
                const newCreditCart = new CreditCard({
                    cardHolderName : nameSurname,
                    creditCardNumber : creditCardNumber,
                    expirationMonth : expirationMonth,
                    expirationYear : expirationYear,
                    cvv : cvv
                })
                await newCreditCart.save()
                res.status(200).redirect("/payment/success"); // Örneğin, başarılı bir yanıt gönder
            })
            .catch(error => {
                console.error("Payment Error:", error);
                res.status(500).json({ error: "Payment failed" }); // Örneğin, hata durumunda bir yanıt gönder
            });

    } catch (error) {
        console.log(error);
        res.status(400);
    }
};


exports.getBasarili = (req,res,next) => {
    res.render("payment/basarili")
}