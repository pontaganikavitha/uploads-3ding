const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: String,
  session: String,
  files: Array,
  subtotal: Number,
  gst: Number,
  shippingCharges: Number,
  total: Number,
});

module.exports = mongoose.model('Order', orderSchema);
