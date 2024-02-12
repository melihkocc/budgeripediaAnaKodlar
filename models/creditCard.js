const mongoose = require("mongoose")
const creditCardSchema = mongoose.Schema({
    cardHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    creditCardNumber: {
      type: String,
      required: true,
    },
    expirationMonth: {
        type: String,
        required: true,
        trim: true,
      },
    expirationYear: {
        type: String,
        required: true,
        trim: true,
      },
    cvv: {
        type: String,
        required: true,
        trim: true,
      },
})

module.exports = mongoose.model("CreditCard",creditCardSchema)