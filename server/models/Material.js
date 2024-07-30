const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: String,
  cost: Number,
});

module.exports = mongoose.model('Material', materialSchema);
