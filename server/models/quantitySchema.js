const mongoose = require('mongoose');

const quantitySchema = new mongoose.Schema({
    fileId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
});

module.exports = mongoose.model('Quantity', quantitySchema);
