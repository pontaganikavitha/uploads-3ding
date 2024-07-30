const mongoose = require('mongoose');

const densitySchema = new mongoose.Schema({
    name: String,
    cost: Number,
});

module.exports = mongoose.model('Density', densitySchema);
