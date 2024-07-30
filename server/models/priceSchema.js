const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    fileId: mongoose.Schema.Types.ObjectId,
    price: Number,
});

module.exports = mongoose.model('Price', priceSchema);
