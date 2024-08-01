const express = require('express');
const Order = require('../models/order');
const router = express.Router();
const io = require('../socket');

// Fetch order details by orderId
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).populate('files');
        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.json(order);
    } catch (error) {
        res.status(500).send('Error fetching order details: ' + error.message);
    }
});

// Update order details
router.put('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { files } = req.body;

    try {
        // Update each file in the order with itemTotal if provided
        const updatedFiles = files.map(file => ({
            ...file,
            itemTotal: file.itemTotal || 0,
            customPrice: file.customPrice
        }));

        // Calculate subtotal based on itemTotal
        const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

        // Calculate gst (assuming gst rate is 18.1% of subtotal)
        const gst = Math.round(subtotal * 0.18);

        // Set shipping charges (assuming no shipping charges for this example)
        const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;

        // Calculate total
        const total = Math.round(subtotal + gst + shippingCharges);

        // Update the order with the updated files array and calculated values
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { files: updatedFiles, subtotal, gst, shippingCharges, total },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Emit socket event to notify clients about order update
        io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Submit a new order
router.post('/submit-order', async (req, res) => {
    try {
        const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;
        const existingOrder = await Order.findOne({ orderId: orderId });

        if (!orderId || !session) {
            return res.status(400).send('Missing orderId or session');
        }

        if (existingOrder) {
            existingOrder.files = files;
            existingOrder.subtotal = subtotal;
            existingOrder.gst = gst;
            existingOrder.shippingCharges = shippingCharges;
            existingOrder.total = total;
            await existingOrder.save();
        } else {
            const newOrder = new Order({ orderId, session, files, subtotal, gst, shippingCharges, total });
            await newOrder.save();
        }

        res.status(201).send('Order submitted successfully');
    } catch (error) {
        res.status(500).send('Error submitting order: ' + error.message);
    }
});

// Fetch all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('files');
        res.json(orders);
    } catch (error) {
        res.status(500).send('Error fetching orders: ' + error.message);
    }
});

module.exports = router;
