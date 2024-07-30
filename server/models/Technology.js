const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('Technology', technologySchema);
