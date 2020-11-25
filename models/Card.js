const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    bankName: {
        type: String,
        required: [true, "Enter Valid Bank Name"],
    },
    cardNumber: {
        type: String,
        required: [true, "Card Number field is required"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},{ timestamps: true });
 
const Card = mongoose.model('Card', cardSchema);

module.exports = Card;