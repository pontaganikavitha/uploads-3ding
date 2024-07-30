// controller.js

const { File, Order, Option } = require('./models'); // Ensure you have defined these models

const uploadFile = async (req, res) => {
  try {
    const { file, originalName, session, orderId } = req.body;
    // Save file to database or storage
    const newFile = new File({ originalName, session, orderId, data: file });
    await newFile.save();
    // Update order with new file
    const order = await Order.findById(orderId);
    order.files.push(newFile._id);
    await order.save();
    res.status(200).json(newFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOptions = (type) => async (req, res) => {
  try {
    const options = await Option.find({ type });
    const optionsMap = options.reduce((acc, option) => {
      acc[option.key] = option.value;
      return acc;
    }, {});
    res.status(200).json(optionsMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLatestOrder = async (req, res) => {
  try {
    const order = await Order.findOne().sort({ createdAt: -1 }).populate('files');
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderFiles = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('files');
    res.status(200).json({ files: order.files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFileOptions = async (req, res) => {
  try {
    const { orderId, fileId } = req.params;
    const { options } = req.body;
    const file = await File.findById(fileId);
    file.options = { ...file.options, ...options };
    await file.save();
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('files');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadFile, getOptions, getLatestOrder, updateFileOptions, getOrderFiles, getAllOrders };
