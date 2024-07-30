// routes.js

const express = require('express');
const router = express.Router();
const { uploadFile, getOptions, getLatestOrder, updateFileOptions, getOrderFiles, getAllOrders } = require('./controller');

// File upload route
router.post('/upload', uploadFile);

// Fetch technology options
router.get('/options/technologies', getOptions('technologies'));

// Fetch material costs
router.get('/options/material-costs', getOptions('material-costs'));

// Fetch density costs
router.get('/options/density-costs', getOptions('density-costs'));

// Fetch quality costs
router.get('/options/quality-costs', getOptions('quality-costs'));

// Fetch latest order
router.get('/orders/latest', getLatestOrder);

// Fetch files for a specific order
router.get('/orders/:orderId/files', getOrderFiles);

// Update file options
router.patch('/orders/:orderId/files/:fileId/options', updateFileOptions);

// Fetch all orders
router.get('/orders', getAllOrders);

module.exports = router;
