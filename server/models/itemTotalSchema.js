const mongoose = require('mongoose');

const itemTotalSchema = new mongoose.Schema({
    fileId: mongoose.Schema.Types.ObjectId,
    itemTotal: Number,
});

module.exports = mongoose.model('ItemTotal', itemTotalSchema);