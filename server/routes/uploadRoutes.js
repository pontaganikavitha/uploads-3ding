const express = require('express');
const multer = require('multer');
const path = require('path');
const STL = require('node-stl');
const File = require('../models/file');
const Order = require('../models/order');
const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// Handle file uploads
router.post('/', upload.single('file'), async (req, res) => {
    const { session, orderId, originalName } = req.body;

    if (!session || !orderId) {
        return res.status(400).send('Missing session or orderId');
    }

    const fileData = {
        name: req.file.filename,
        originalName: originalName,
        url: req.file.path,
        session: session,
        orderId: orderId,
    };

    try {
        if (req.file.originalname.endsWith('.stl')) {
            const stl = new STL(req.file.path);
            fileData.dimensions = {
                length: stl.boundingBox[0],
                width: stl.boundingBox[1],
                height: stl.boundingBox[2],
            };
            fileData.buildVolume = stl.volume;
        }

        const existingOrder = await Order.findOne({ orderId: orderId });
        if (existingOrder) {
            existingOrder.files.push(fileData);
            await existingOrder.save();
        } else {
            const newOrder = new Order({
                orderId,
                session,
                files: [fileData],
                subtotal: 0,
                gst: 0,
                shippingCharges: 0,
                total: 0,
            });
            await newOrder.save();
        }

        await new File(fileData).save();
        const updatedFiles = await File.find({ session: session });
        res.status(201).json(updatedFiles);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
