const orderSchema = new mongoose.Schema({
  orderId: String,
  session: String,
  files: [
    {
      name: String,
      size: Number,
      type: String,
      buildVolume: Number,
      url: String,
      options: {
        technology: String,
        material: String,
        color: String,
        quality: String,
        density: String,
        quantity: Number
      }
    }
  ],
  subtotal: Number,
  gst: Number,
  shippingCharges: Number,
  total: Number
});
