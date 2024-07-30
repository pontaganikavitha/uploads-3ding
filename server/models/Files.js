// fileSchema.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    orderId: String,
    session: String,
    name: String,
    originalName: String,
    url: String,
    buildVolume: Number,
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
    },
});

module.exports = mongoose.model('Files', fileSchema);