const mongoose = require('mongoose');

const qualitySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('Quality', qualitySchema);
