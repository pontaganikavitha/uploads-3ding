// // // const express = require('express');
// // // const mongoose = require('mongoose');
// // // const multer = require('multer');
// // // const path = require('path');
// // // const STL = require('node-stl');
// // // const bodyParser = require('body-parser');
// // // const cors = require('cors');
// // // const http = require('http');
// // // const socketIo = require('socket.io');

// // // const app = express();
// // // const server = http.createServer(app);
// // // const io = socketIo(server);

// // // app.use(bodyParser.json());
// // // app.use(cors());

// // // // Connect to MongoDB
// // // mongoose.connect('mongodb://localhost:27017/myy-uploads');

// // const express = require('express');
// // const mongoose = require('mongoose');
// // const multer = require('multer');
// // const path = require('path');
// // const STL = require('node-stl');
// // const bodyParser = require('body-parser');
// // const cors = require('cors');
// // const http = require('http');
// // const socketIo = require('socket.io');

// // const app = express();
// // const server = http.createServer(app);
// // // const io = socketIo(server);

// // const io = socketIo(server, {
// //   cors: {
// //     origin: ['http://localhost:3000', 'http://localhost:3002'],
// //     methods: ['GET', 'POST'],
// //   }
// // });

// // // CORS middleware setup
// // const corsOptions = {
// //   origin: ['http://localhost:3000', 'http://localhost:3002'],
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //   credentials: true,
// // };

// // app.use(cors(corsOptions));


// // app.use(bodyParser.json());
// // // app.use(cors());

// // // Connect to MongoDB
// // mongoose.connect('mongodb://localhost:27017/myy-uploads');

// // // Define Schema for uploaded files
// // const fileSchema = new mongoose.Schema({
// //   orderId: String,
// //   session: String,
// //   name: String,
// //   originalName: String,
// //   url: String,
// //   buildVolume: Number,
// //   dimensions: {
// //     length: Number,
// //     width: Number,
// //     height: Number,
// //   },
// // });

// // const File = mongoose.model('File', fileSchema);

// // const orderSchema = new mongoose.Schema({
// //   orderId: String,
// //   session: String,
// //   files: Array,
// //   subtotal: Number,
// //   gst: Number,
// //   shippingCharges: Number,
// //   total: Number,
// // });

// // const Order = mongoose.model('Order', orderSchema);

// // // Set up Multer for file uploads
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, 'uploads/');
// //   },
// //   filename: (req, file, cb) => {
// //     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
// //   },
// // });

// // const upload = multer({ storage });

// // // Handle file uploads
// // app.post('/upload', upload.single('file'), async (req, res) => {
// //   const { session, orderId, originalName } = req.body;

// //   console.log('Received upload request:', { session, orderId, originalName });

// //   if (!session || !orderId) {
// //     return res.status(400).send('Missing session or orderId');
// //   }

// //   const fileData = {
// //     name: req.file.filename,
// //     originalName: originalName,
// //     url: req.file.path,
// //     session: session,
// //     orderId: orderId,
// //   };

// //   try {
// //     if (req.file.originalname.endsWith('.stl')) {
// //       const stl = new STL(req.file.path);
// //       fileData.dimensions = {
// //         length: stl.boundingBox[0],
// //         width: stl.boundingBox[1],
// //         height: stl.boundingBox[2],
// //       };
// //       fileData.buildVolume = stl.volume;
// //     }

// //     const existingOrder = await Order.findOne({ orderId: orderId });
// //     if (existingOrder) {
// //       existingOrder.files.push(fileData);
// //       await existingOrder.save();
// //     } else {
// //       const newOrder = new Order({
// //         orderId,
// //         session,
// //         files: [fileData],
// //         subtotal: 0,
// //         gst: 0,
// //         shippingCharges: 0,
// //         total: 0,
// //       });
// //       await newOrder.save();
// //     }

// //     await new File(fileData).save();
// //     const updatedFiles = await File.find({ session: session });
// //     res.status(201).json(updatedFiles);
// //   } catch (err) {
// //     res.status(500).send(err.message);
// //   }
// // });

// // // Enable GET request to fetch files for a specific session
// // app.get('/files/:session', async (req, res) => {
// //   try {
// //     const files = await File.find({ session: req.params.session });
// //     res.json(files);
// //   } catch (err) {
// //     res.status(500).send(err.message);
// //   }
// // });

// // // Fetch order details by orderId
// // app.get('/orders/:orderId', async (req, res) => {
// //   try {
// //     const order = await Order.findOne({ orderId: req.params.orderId }).populate('files');
// //     if (!order) {
// //       return res.status(404).send('Order not found');
// //     }
// //     res.json(order);
// //   } catch (error) {
// //     res.status(500).send('Error fetching order details: ' + error.message);
// //   }
// // });


// // // Update order details
// // app.put('/orders/:orderId', async (req, res) => {
// //   const { orderId } = req.params;
// //   const { files } = req.body;

// //   try {
// //     // Update each file in the order with itemTotal if provided
// //     const updatedFiles = files.map(file => ({
// //       ...file,
// //       itemTotal: file.itemTotal || 0,
// //       customPrice: file.customPrice,
// //     }));

// //     // Calculate subtotal based on itemTotal
// //     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

// //     // Calculate gst (assuming gst rate is 18.1% of subtotal)
// //     const gst = Math.round(subtotal * 0.18);

// //     // Set shipping charges (assuming no shipping charges for this example)
// //     const shippingCharges = 0;

// //     // Calculate total
// //     const total = Math.round(subtotal + gst + shippingCharges);

// //     // Update the order with the updated files array and calculated values
// //     const updatedOrder = await Order.findOneAndUpdate(
// //       { orderId: orderId },
// //       { files: updatedFiles, subtotal, gst, shippingCharges, total },
// //       { new: true }
// //     );

// //     if (!updatedOrder) {
// //       return res.status(404).json({ error: 'Order not found' });
// //     }

// //     // Emit socket event to notify clients about order update
// //     io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

// //     res.json(updatedOrder);
// //   } catch (error) {
// //     console.error('Error updating order:', error);
// //     res.status(500).json({ error: 'Failed to update order' });
// //   }
// // });


// // // Submit a new order
// // app.post('/submit-order', async (req, res) => {
// //   try {
// //     const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;
// //     const existingOrder = await Order.findOne({ orderId: orderId });

// //     console.log('Received submit order request:', { orderId, session, files, subtotal, gst, shippingCharges, total });

// //     if (!orderId || !session) {
// //       return res.status(400).send('Missing orderId or session');
// //     }

// //     if (existingOrder) {
// //       existingOrder.files = files;
// //       existingOrder.subtotal = subtotal;
// //       existingOrder.gst = gst;
// //       existingOrder.shippingCharges = shippingCharges;
// //       existingOrder.total = total;
// //       await existingOrder.save();
// //     } else {
// //       const newOrder = new Order({ orderId, session, files, subtotal, gst, shippingCharges, total });
// //       await newOrder.save();
// //     }

// //     res.status(201).send('Order submitted successfully');
// //   } catch (error) {
// //     res.status(500).send('Error submitting order: ' + error.message);
// //   }
// // });

// // // Fetch all orders
// // app.get('/orders', async (req, res) => {
// //   try {
// //     const orders = await Order.find().populate('files');
// //     res.json(orders);
// //   } catch (error) {
// //     res.status(500).send('Error fetching orders: ' + error.message);
// //   }
// // });

// // // Update order with new files and recalculate totals
// // app.put('/update-order/:orderId', async (req, res) => {
// //   const { orderId } = req.params;
// //   const { newFiles } = req.body; // new files to be added

// //   try {
// //     const existingOrder = await Order.findOne({ orderId: orderId });

// //     if (!existingOrder) {
// //       return res.status(404).send('Order not found');
// //     }

// //     // Add new files to the existing order
// //     const updatedFiles = [...existingOrder.files, ...newFiles];

// //     // Calculate subtotal based on itemTotal of all files
// //     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

// //     // Calculate GST (assuming GST rate is 18.1% of subtotal)
// //     const gst = Math.round(subtotal * 0.18);

// //     // Set shipping charges (assuming shipping charges are based on subtotal)
// //     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;

// //     // Calculate total
// //     const total = Math.round(subtotal + gst + shippingCharges);

// //     // Update the order with the new files and recalculated values
// //     existingOrder.files = updatedFiles;
// //     existingOrder.subtotal = subtotal;
// //     existingOrder.gst = gst;
// //     existingOrder.shippingCharges = shippingCharges;
// //     existingOrder.total = total;

// //     await existingOrder.save();

// //     // Emit socket event to notify clients about order update
// //     io.emit('orderUpdated', { orderId: existingOrder.orderId, updatedOrder: existingOrder });

// //     res.json(existingOrder);
// //   } catch (error) {
// //     console.error('Error updating order:', error);
// //     res.status(500).json({ error: 'Failed to update order' });
// //   }
// // });


// // // Fetch options for technology, material, color, quality, and density
// // app.get('/options', async (req, res) => {
// //   try {
// //     const optionsData = {
// //       technologyOptions: {
// //         'SLS': {
// //           material: ['Nylon 2200'],
// //           color: ['Default'],
// //           quality: ['Default'],
// //           density: ['Default'],
// //         },
// //         'SLA': {
// //           material: ['ABS', 'Clear Resin', 'Translucent'],
// //           color: ['White'],
// //           quality: ['Default'],
// //           density: ['Default'],
// //         },
// //         'MJF': {
// //           material: ['Nylon PA12'],
// //           color: ['Grey'],
// //           quality: ['Default'],
// //           density: ['Default'],
// //         },
// //         'DLP': {
// //           material: ['Green Castable Resin'],
// //           color: ['Green'],
// //           quality: ['Default'],
// //           density: ['Default'],
// //         },
// //         'MJP': {
// //           material: ['White/Clear Resin'],
// //           color: ['White/Clear'],
// //           quality: ['Default'],
// //           density: ['Default'],
// //         },
// //         'PJP': {
// //           material: ['Clear Resin', 'Agilus 30'],
// //           color: ['Clear'],
// //           quality: ['Default'],
// //           density: ['Default'],
// //         },
// //         'FDM/FFF': {
// //           material: ['PLA', 'ABS', 'HIPS', 'Flexible', 'PET G', 'Copper', 'Brass', 'Wood', 'Marble'],
// //           color: ['White', 'Black', 'Red', 'Grey', 'Green', 'Natural', 'Yellow'],
// //           quality: ['Draft', 'High', 'Standard'],
// //           density: ['20%', '30%', '50%', '100%'],
// //         },
// //       },
// //       materialCosts: {
// //         'PLA': 2,
// //         'ABS': 3,
// //         'HIPS': 4,
// //         'Flexible': 5,
// //         'PET G': 6,
// //         'Copper': 7,
// //       },
// //       densityCosts: {
// //         '20%': 2,
// //         '30%': 3,
// //         '50%': 4,
// //         '100%': 5,
// //       },
// //       qualityCosts: {
// //         'Draft': 2,
// //         'Standard': 3,
// //         'High': 4,
// //       },
// //     };
// //     res.json(optionsData);
// //   } catch (error) {
// //     console.error('Error fetching options data:', error);
// //     res.status(500).send('Error fetching options data');
// //   }
// // });

// // // Serve static files
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // server.listen(3001, () => {
// //   console.log('Server is running on port 3001');
// // });



// // // const express = require('express');
// // // const mongoose = require('mongoose');
// // // const multer = require('multer');
// // // const path = require('path');
// // // const STL = require('node-stl');
// // // const bodyParser = require('body-parser');
// // // const cors = require('cors');
// // // const http = require('http');
// // // const socketIo = require('socket.io');

// // // const app = express();
// // // const server = http.createServer(app);
// // // const io = socketIo(server);

// // // app.use(bodyParser.json());
// // // app.use(cors());

// // // // Connect to MongoDB
// // // mongoose.connect('mongodb://localhost:27017/myy-uploads');

// // // // Define Schema for uploaded files
// // // const fileSchema = new mongoose.Schema({
// // //   orderId: String,
// // //   session: String,
// // //   name: String,
// // //   originalName: String,
// // //   url: String,
// // //   buildVolume: Number,
// // //   dimensions: {
// // //     length: Number,
// // //     width: Number,
// // //     height: Number,
// // //   },
// // // });

// // // const File = mongoose.model('File', fileSchema);

// // // const orderSchema = new mongoose.Schema({
// // //   orderId: String,
// // //   session: String,
// // //   files: Array,
// // //   subtotal: Number,
// // //   gst: Number,
// // //   shippingCharges: Number,
// // //   total: Number,
// // // });

// // // const Order = mongoose.model('Order', orderSchema);

// // // // Set up Multer for file uploads
// // // const storage = multer.diskStorage({
// // //   destination: (req, file, cb) => {
// // //     cb(null, 'uploads/');
// // //   },
// // //   filename: (req, file, cb) => {
// // //     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
// // //   },
// // // });

// // // const upload = multer({ storage });

// // // // Handle file uploads
// // // app.post('/upload', upload.single('file'), async (req, res) => {
// // //   const { session, orderId, originalName } = req.body;

// // //   console.log('Received upload request:', { session, orderId, originalName });

// // //   if (!session || !orderId) {
// // //     return res.status(400).send('Missing session or orderId');
// // //   }

// // //   const fileData = {
// // //     name: req.file.filename,
// // //     originalName: originalName,
// // //     url: req.file.path,
// // //     session: session,
// // //     orderId: orderId,
// // //   };

// // //   try {
// // //     if (req.file.originalname.endsWith('.stl')) {
// // //       const stl = new STL(req.file.path);
// // //       fileData.dimensions = {
// // //         length: stl.boundingBox[0],
// // //         width: stl.boundingBox[1],
// // //         height: stl.boundingBox[2],
// // //       };
// // //       fileData.buildVolume = stl.volume;
// // //     }

// // //     const existingOrder = await Order.findOne({ orderId: orderId });
// // //     if (existingOrder) {
// // //       existingOrder.files.push(fileData);
// // //       await existingOrder.save();
// // //     } else {
// // //       const newOrder = new Order({
// // //         orderId,
// // //         session,
// // //         files: [fileData],
// // //         subtotal: 0,
// // //         gst: 0,
// // //         shippingCharges: 0,
// // //         total: 0,
// // //       });
// // //       await newOrder.save();
// // //     }

// // //     await new File(fileData).save();
// // //     const updatedFiles = await File.find({ session: session });
// // //     res.status(201).json(updatedFiles);
// // //   } catch (err) {
// // //     res.status(500).send(err.message);
// // //   }
// // // });

// // // // Enable GET request to fetch files for a specific session
// // // app.get('/files/:session', async (req, res) => {
// // //   try {
// // //     const files = await File.find({ session: req.params.session });
// // //     res.json(files);
// // //   } catch (err) {
// // //     res.status(500).send(err.message);
// // //   }
// // // });

// // // // Fetch order details by orderId
// // // app.get('/orders/:orderId', async (req, res) => {
// // //   try {
// // //     const order = await Order.findOne({ orderId: req.params.orderId }).populate('files');
// // //     if (!order) {
// // //       return res.status(404).send('Order not found');
// // //     }
// // //     res.json(order);
// // //   } catch (error) {
// // //     res.status(500).send('Error fetching order details: ' + error.message);
// // //   }
// // // });

// // // // // Update order details
// // // // app.put('/orders/:orderId', async (req, res) => {
// // // //   const { orderId } = req.params;
// // // //   const { files } = req.body;

// // // //   try {
// // // //     // Update each file in the order with customPrice if provided
// // // //     const updatedFiles = files.map(file => ({
// // // //       ...file,
// // // //       price: file.price || 0 // Use customPrice if provided, otherwise fallback to price
// // // //     }));

// // // //     // Calculate subtotal
// // // //     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.price || 0), 0));

// // // //     // Calculate gst (assuming gst rate is 18.1% of subtotal)
// // // //     const gst = Math.round(subtotal * 0.18);

// // // //     // Set shipping charges (assuming no shipping charges for this example)
// // // //     const shippingCharges = 0;

// // // //     // Calculate total
// // // //     const total = Math.round(subtotal + gst + shippingCharges)

// // // //     // Update the order with the updated files array and calculated values
// // // //     const updatedOrder = await Order.findOneAndUpdate(
// // // //       { orderId: orderId },  // Update query to use orderId
// // // //       { files: updatedFiles, subtotal, gst, shippingCharges, total },
// // // //       { new: true }
// // // //     );

// // // //     if (!updatedOrder) {
// // // //       return res.status(404).json({ error: 'Order not found' });
// // // //     }

// // // //     // Emit socket event to notify clients about order update
// // // //     io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

// // // //     res.json(updatedOrder);
// // // //   } catch (error) {
// // // //     console.error('Error updating order:', error);
// // // //     res.status(500).json({ error: 'Failed to update order' });
// // // //   }
// // // // });

// // // // Update order details
// // // // app.put('/orders/:orderId', async (req, res) => {
// // // //   const { orderId } = req.params;
// // // //   const { files } = req.body;

// // // //   try {
// // // //     // Update each file in the order with itemTotal if provided
// // // //     const updatedFiles = files.map(file => ({
// // // //       ...file,
// // // //       itemTotal: file.itemTotal || 0,
// // // //       customPrice: file.customPrice,
// // // //     }));

// // // //     // Calculate subtotal based on itemTotal
// // // //     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

// // // //     // Calculate gst (assuming gst rate is 18.1% of subtotal)
// // // //     const gst = Math.round(subtotal * 0.18);

// // // //     // Set shipping charges (assuming no shipping charges for this example)
// // // //     const shippingCharges = 0;

// // // //     // Calculate total
// // // //     const total = Math.round(subtotal + gst + shippingCharges);

// // // //     // Update the order with the updated files array and calculated values
// // // //     const updatedOrder = await Order.findOneAndUpdate(
// // // //       { orderId: orderId },
// // // //       { files: updatedFiles, subtotal, gst, shippingCharges, total },
// // // //       { new: true }
// // // //     );

// // // //     if (!updatedOrder) {
// // // //       return res.status(404).json({ error: 'Order not found' });
// // // //     }

// // // //     // Emit socket event to notify clients about order update
// // // //     io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

// // // //     res.json(updatedOrder);
// // // //   } catch (error) {
// // // //     console.error('Error updating order:', error);
// // // //     res.status(500).json({ error: 'Failed to update order' });
// // // //   }
// // // // });

// // // // Update order details
// // // app.put('/orders/:orderId', async (req, res) => {
// // //   const { orderId } = req.params;
// // //   const { files } = req.body;

// // //   try {
// // //     const updatedFiles = files.map(file => ({
// // //       ...file,
// // //       itemTotal: file.itemTotal || 0,
// // //       customPrice: file.customPrice,
// // //     }));

// // //     // Calculate subtotal based on itemTotal for all files
// // //     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

// // //     // Calculate gst and shipping charges
// // //     const gst = Math.round(subtotal * 0.18);
// // //     const shippingCharges = 0;
// // //     const total = Math.round(subtotal + gst + shippingCharges);

// // //     // Update the order with the recalculated values
// // //     const updatedOrder = await Order.findOneAndUpdate(
// // //       { orderId: orderId },
// // //       { files: updatedFiles, subtotal, gst, shippingCharges, total },
// // //       { new: true }
// // //     );

// // //     if (!updatedOrder) {
// // //       return res.status(404).json({ error: 'Order not found' });
// // //     }

// // //     io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

// // //     res.json(updatedOrder);
// // //   } catch (error) {
// // //     console.error('Error updating order:', error);
// // //     res.status(500).json({ error: 'Failed to update order' });
// // //   }
// // // });



// // // // Submit a new order
// // // app.post('/submit-order', async (req, res) => {
// // //   try {
// // //     const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;
// // //     const existingOrder = await Order.findOne({ orderId: orderId });

// // //     console.log('Received submit order request:', { orderId, session, files, subtotal, gst, shippingCharges, total });

// // //     if (!orderId || !session) {
// // //       return res.status(400).send('Missing orderId or session');
// // //     }

// // //     if (existingOrder) {
// // //       existingOrder.files = files;
// // //       existingOrder.subtotal = subtotal;
// // //       existingOrder.gst = gst;
// // //       existingOrder.shippingCharges = shippingCharges;
// // //       existingOrder.total = total;
// // //       await existingOrder.save();
// // //     } else {
// // //       const newOrder = new Order({ orderId, session, files, subtotal, gst, shippingCharges, total });
// // //       await newOrder.save();
// // //     }

// // //     res.status(201).send('Order submitted successfully');
// // //   } catch (error) {
// // //     res.status(500).send('Error submitting order: ' + error.message);
// // //   }
// // // });

// // // // Fetch all orders
// // // app.get('/orders', async (req, res) => {
// // //   try {
// // //     const orders = await Order.find().populate('files');
// // //     res.json(orders);
// // //   } catch (error) {
// // //     res.status(500).send('Error fetching orders: ' + error.message);
// // //   }
// // // });

// // // // Update order with new files and recalculate totals
// // // app.put('/update-order/:orderId', async (req, res) => {
// // //   const { orderId } = req.params;
// // //   const { newFiles } = req.body; // new files to be added

// // //   try {
// // //     const existingOrder = await Order.findOne({ orderId: orderId });

// // //     if (!existingOrder) {
// // //       return res.status(404).send('Order not found');
// // //     }

// // //     // Add new files to the existing order
// // //     const updatedFiles = [...existingOrder.files, ...newFiles];

// // //     // Calculate subtotal based on itemTotal of all files
// // //     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

// // //     // Calculate GST (assuming GST rate is 18.1% of subtotal)
// // //     const gst = Math.round(subtotal * 0.18);

// // //     // Set shipping charges (assuming shipping charges are based on subtotal)
// // //     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;

// // //     // Calculate total
// // //     const total = Math.round(subtotal + gst + shippingCharges);

// // //     // Update the order with the new files and recalculated values
// // //     existingOrder.files = updatedFiles;
// // //     existingOrder.subtotal = subtotal;
// // //     existingOrder.gst = gst;
// // //     existingOrder.shippingCharges = shippingCharges;
// // //     existingOrder.total = total;

// // //     await existingOrder.save();

// // //     // Emit socket event to notify clients about order update
// // //     io.emit('orderUpdated', { orderId: existingOrder.orderId, updatedOrder: existingOrder });

// // //     res.json(existingOrder);
// // //   } catch (error) {
// // //     console.error('Error updating order:', error);
// // //     res.status(500).json({ error: 'Failed to update order' });
// // //   }
// // // });


// // // // Fetch options for technology, material, color, quality, and density
// // // app.get('/options', async (req, res) => {
// // //   try {
// // //     const optionsData = {
// // //       technologyOptions: {
// // //         'SLS': {
// // //           material: ['Nylon 2200'],
// // //           color: ['Default'],
// // //           quality: ['Default'],
// // //           density: ['Default'],
// // //         },
// // //         'SLA': {
// // //           material: ['ABS', 'Clear Resin', 'Translucent'],
// // //           color: ['White'],
// // //           quality: ['Default'],
// // //           density: ['Default'],
// // //         },
// // //         'MJF': {
// // //           material: ['Nylon PA12'],
// // //           color: ['Grey'],
// // //           quality: ['Default'],
// // //           density: ['Default'],
// // //         },
// // //         'DLP': {
// // //           material: ['Green Castable Resin'],
// // //           color: ['Green'],
// // //           quality: ['Default'],
// // //           density: ['Default'],
// // //         },
// // //         'MJP': {
// // //           material: ['White/Clear Resin'],
// // //           color: ['White/Clear'],
// // //           quality: ['Default'],
// // //           density: ['Default'],
// // //         },
// // //         'PJP': {
// // //           material: ['Clear Resin', 'Agilus 30'],
// // //           color: ['Clear'],
// // //           quality: ['Default'],
// // //           density: ['Default'],
// // //         },
// // //         'FDM/FFF': {
// // //           material: ['PLA', 'ABS', 'HIPS', 'Flexible', 'PET G', 'Copper', 'Brass', 'Wood', 'Marble'],
// // //           color: ['White', 'Black', 'Red', 'Grey', 'Green', 'Natural', 'Yellow'],
// // //           quality: ['Draft', 'High', 'Standard'],
// // //           density: ['20%', '30%', '50%', '100%'],
// // //         },
// // //       },
// // //       materialCosts: {
// // //         'PLA': 2,
// // //         'ABS': 3,
// // //         'HIPS': 4,
// // //         'Flexible': 5,
// // //         'PET G': 6,
// // //         'Copper': 7,
// // //       },
// // //       densityCosts: {
// // //         '20%': 2,
// // //         '30%': 3,
// // //         '50%': 4,
// // //         '100%': 5,
// // //       },
// // //       qualityCosts: {
// // //         'Draft': 2,
// // //         'Standard': 3,
// // //         'High': 4,
// // //       },
// // //     };
// // //     res.json(optionsData);
// // //   } catch (error) {
// // //     console.error('Error fetching options data:', error);
// // //     res.status(500).send('Error fetching options data');
// // //   }
// // // });

// // // // Serve static files
// // // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // server.listen(3001, () => {
// // //   console.log('Server is running on port 3001');
// // // });


// // server.js

// require('dotenv').config(); // Load environment variables from .env

// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const STL = require('node-stl');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const fs = require('fs');
// const os = require('os');
// const util = require('util');

// // Promisify unlink for easier async/await usage
// const unlinkFile = util.promisify(fs.unlink);

// const app = express();
// const server = http.createServer(app);

// // Configure Socket.IO with CORS
// const io = socketIo(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3002'],
//     methods: ['GET', 'POST'],
//   },
// });

// // CORS middleware setup
// const corsOptions = {
//   origin: ['http://localhost:3000', 'http://localhost:3002'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // Connect to MongoDB without deprecated options
// mongoose.connect('mongodb://localhost:27017/myy-uploads')
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Define Schema for uploaded files
// const fileSchema = new mongoose.Schema({
//   orderId: String,
//   session: String,
//   name: String,
//   originalName: String,
//   url: String,
//   buildVolume: Number,
//   dimensions: {
//     length: Number,
//     width: Number,
//     height: Number,
//   },
// });

// const File = mongoose.model('File', fileSchema);

// // Define Schema for orders
// const orderSchema = new mongoose.Schema({
//   orderId: String,
//   session: String,
//   files: [fileSchema], // Embed file documents
//   subtotal: Number,
//   gst: Number,
//   shippingCharges: Number,
//   total: Number,
// });

// const Order = mongoose.model('Order', orderSchema);

// // Configure AWS S3 Client (AWS SDK v3)
// const s3 = new S3Client({
//   region: process.env.AWS_REGION, // Ensure these are set in your .env file
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// const S3_BUCKET = process.env.S3_BUCKET;

// // Set up Multer for file uploads using memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Handle file uploads
// app.post('/upload', upload.single('file'), async (req, res) => {
//   const { session, orderId, originalName } = req.body;

//   console.log('Received upload request:', { session, orderId, originalName });

//   if (!session || !orderId) {
//     return res.status(400).send('Missing session or orderId');
//   }

//   // Generate a unique filename
//   const uniqueFileName = `${Date.now()}-${path.basename(req.file.originalname)}`;

//   try {
//     // Initialize file data object
//     const fileData = {
//       name: uniqueFileName,
//       originalName: originalName,
//       session: session,
//       orderId: orderId,
//     };

//     // If the uploaded file is an STL, extract dimensions and volume
//     if (req.file.originalname.toLowerCase().endsWith('.stl')) {
//       const tempFilePath = path.join(os.tmpdir(), uniqueFileName);
//       await fs.promises.writeFile(tempFilePath, req.file.buffer);
//       const stl = new STL(tempFilePath);
//       fileData.dimensions = {
//         length: stl.boundingBox[0],
//         width: stl.boundingBox[1],
//         height: stl.boundingBox[2],
//       };
//       fileData.buildVolume = stl.volume;
//       // Remove the temporary file
//       await unlinkFile(tempFilePath);
//     }

//     // Define S3 upload parameters using AWS SDK v3
//     const params = {
//       Bucket: S3_BUCKET,
//       Key: `uploads/${uniqueFileName}`, // File will be saved under 'uploads/' prefix in S3
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//       ACL: 'public-read', // Adjust permissions as needed
//     };

//     // Upload the file to S3
//     const command = new PutObjectCommand(params);
//     await s3.send(command);

//     // Construct the S3 file URL
//     const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}`;
//     fileData.url = fileUrl;

//     // Update or create the order in MongoDB
//     let existingOrder = await Order.findOne({ orderId: orderId });

//     if (existingOrder) {
//       existingOrder.files.push(fileData);
//       await existingOrder.save();
//     } else {
//       existingOrder = new Order({
//         orderId,
//         session,
//         files: [fileData],
//         subtotal: 0,
//         gst: 0,
//         shippingCharges: 0,
//         total: 0,
//       });
//       await existingOrder.save();
//     }

//     // Save the file metadata to the File collection
//     const newFile = new File(fileData);
//     await newFile.save();

//     // Retrieve updated files for the session
//     const updatedFiles = await File.find({ session: session });

//     res.status(201).json(updatedFiles);
//   } catch (err) {
//     console.error('Error during file upload:', err);
//     res.status(500).send(err.message);
//   }
// });

// // Enable GET request to fetch files for a specific session
// app.get('/files/:session', async (req, res) => {
//   try {
//     const files = await File.find({ session: req.params.session });
//     res.json(files);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// // Fetch order details by orderId
// app.get('/orders/:orderId', async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.orderId }).populate('files');
//     if (!order) {
//       return res.status(404).send('Order not found');
//     }
//     res.json(order);
//   } catch (error) {
//     res.status(500).send('Error fetching order details: ' + error.message);
//   }
// });

// // Update order details
// app.put('/orders/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { files } = req.body;

//   try {
//     // Update each file in the order with itemTotal if provided
//     const updatedFiles = files.map(file => ({
//       ...file,
//       itemTotal: file.itemTotal || 0,
//       customPrice: file.customPrice,
//     }));

//     // Calculate subtotal based on itemTotal
//     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

//     // Calculate GST (assuming GST rate is 18% of subtotal)
//     const gst = Math.round(subtotal * 0.18);

//     // Set shipping charges (assuming no shipping charges for this example)
//     const shippingCharges = 0;

//     // Calculate total
//     const total = Math.round(subtotal + gst + shippingCharges);

//     // Update the order with the updated files array and calculated values
//     const updatedOrder = await Order.findOneAndUpdate(
//       { orderId: orderId },
//       { files: updatedFiles, subtotal, gst, shippingCharges, total },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // Emit socket event to notify clients about order update
//     io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

//     res.json(updatedOrder);
//   } catch (error) {
//     console.error('Error updating order:', error);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });

// // Submit a new order
// app.post('/submit-order', async (req, res) => {
//   try {
//     const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;
//     const existingOrder = await Order.findOne({ orderId: orderId });

//     console.log('Received submit order request:', { orderId, session, files, subtotal, gst, shippingCharges, total });

//     if (!orderId || !session) {
//       return res.status(400).send('Missing orderId or session');
//     }

//     if (existingOrder) {
//       existingOrder.files = files;
//       existingOrder.subtotal = subtotal;
//       existingOrder.gst = gst;
//       existingOrder.shippingCharges = shippingCharges;
//       existingOrder.total = total;
//       await existingOrder.save();
//     } else {
//       const newOrder = new Order({ orderId, session, files, subtotal, gst, shippingCharges, total });
//       await newOrder.save();
//     }

//     res.status(201).send('Order submitted successfully');
//   } catch (error) {
//     res.status(500).send('Error submitting order: ' + error.message);
//   }
// });

// // Fetch all orders
// app.get('/orders', async (req, res) => {
//   try {
//     const orders = await Order.find().populate('files');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).send('Error fetching orders: ' + error.message);
//   }
// });

// // Update order with new files and recalculate totals
// app.put('/update-order/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { newFiles } = req.body; // new files to be added

//   try {
//     const existingOrder = await Order.findOne({ orderId: orderId });

//     if (!existingOrder) {
//       return res.status(404).send('Order not found');
//     }

//     // Add new files to the existing order
//     const updatedFiles = [...existingOrder.files, ...newFiles];

//     // Calculate subtotal based on itemTotal of all files
//     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

//     // Calculate GST (assuming GST rate is 18% of subtotal)
//     const gst = Math.round(subtotal * 0.18);

//     // Set shipping charges (assuming shipping charges are based on subtotal)
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;

//     // Calculate total
//     const total = Math.round(subtotal + gst + shippingCharges);

//     // Update the order with the new files and recalculated values
//     existingOrder.files = updatedFiles;
//     existingOrder.subtotal = subtotal;
//     existingOrder.gst = gst;
//     existingOrder.shippingCharges = shippingCharges;
//     existingOrder.total = total;

//     await existingOrder.save();

//     // Emit socket event to notify clients about order update
//     io.emit('orderUpdated', { orderId: existingOrder.orderId, updatedOrder: existingOrder });

//     res.json(existingOrder);
//   } catch (error) {
//     console.error('Error updating order:', error);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });

// // Fetch options for technology, material, color, quality, and density
// app.get('/options', async (req, res) => {
//   try {
//     const optionsData = {
//       technologyOptions: {
//         'SLS': {
//           material: ['Nylon 2200'],
//           color: ['Default'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         'SLA': {
//           material: ['ABS', 'Clear Resin', 'Translucent'],
//           color: ['White'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         'MJF': {
//           material: ['Nylon PA12'],
//           color: ['Grey'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         'DLP': {
//           material: ['Green Castable Resin'],
//           color: ['Green'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         'MJP': {
//           material: ['White/Clear Resin'],
//           color: ['White/Clear'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         'PJP': {
//           material: ['Clear Resin', 'Agilus 30'],
//           color: ['Clear'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         'FDM/FFF': {
//           material: ['PLA', 'ABS', 'HIPS', 'Flexible', 'PET G', 'Copper', 'Brass', 'Wood', 'Marble'],
//           color: ['White', 'Black', 'Red', 'Grey', 'Green', 'Natural', 'Yellow'],
//           quality: ['Draft', 'High', 'Standard'],
//           density: ['20%', '30%', '50%', '100%'],
//         },
//       },
//       materialCosts: {
//         'PLA': 2,
//         'ABS': 3,
//         'HIPS': 4,
//         'Flexible': 5,
//         'PET G': 6,
//         'Copper': 7,
//       },
//       densityCosts: {
//         '20%': 2,
//         '30%': 3,
//         '50%': 4,
//         '100%': 5,
//       },
//       qualityCosts: {
//         'Draft': 2,
//         'Standard': 3,
//         'High': 4,
//       },
//     };
//     res.json(optionsData);
//   } catch (error) {
//     console.error('Error fetching options data:', error);
//     res.status(500).send('Error fetching options data');
//   }
// });

// // Remove local uploads directory serving since files are now on S3
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Removed

// // Start the server
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });





// // server.js

// require('dotenv').config(); // Load environment variables from .env

// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const STL = require('node-stl');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');
// const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const fs = require('fs');
// const os = require('os');
// const util = require('util');

// // Promisify unlink for easier async/await usage
// const unlinkFile = util.promisify(fs.unlink);

// // Initialize Express app
// const app = express();
// const server = http.createServer(app);

// // Configure Socket.IO (if real-time updates are needed)
// const io = socketIo(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3002'], // Update with your client origins
//     methods: ['GET', 'POST'],
//   },
// });

// // CORS middleware setup
// const corsOptions = {
//   origin: ['http://localhost:3000', 'http://localhost:3002'], // Update with your client origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // Connect to MongoDB without deprecated options
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     // Use the new URL parser and unified topology by default in Mongoose 6+
//   })
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Define Mongoose Schemas and Models

// // File Schema
// const fileSchema = new mongoose.Schema({
//   orderId: { type: String, required: true },
//   session: { type: String, required: true },
//   name: { type: String, required: true }, // Unique file name
//   originalName: { type: String, required: true }, // Original file name
//   url: { type: String, required: true }, // S3 URL
//   buildVolume: { type: Number, default: 0 }, // Volume extracted from STL
//   dimensions: {
//     length: { type: Number, default: 0 },
//     width: { type: Number, default: 0 },
//     height: { type: Number, default: 0 },
//   },
//   // Optional: price and quantity fields if needed
//   price: { type: Number, default: 0 },
//   quantity: { type: Number, default: 1 },
// });

// const File = mongoose.model('File', fileSchema);

// // Order Schema
// const orderSchema = new mongoose.Schema({
//   orderId: { type: String, required: true, unique: true },
//   session: { type: String, required: true },
//   files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
//   subtotal: { type: Number, default: 0 },
//   gst: { type: Number, default: 0 },
//   shippingCharges: { type: Number, default: 0 },
//   total: { type: Number, default: 0 },
// });

// const Order = mongoose.model('Order', orderSchema);

// // Configure AWS S3 Client (AWS SDK v3)
// const s3 = new S3Client({
//   region: process.env.AWS_REGION, // Ensure this is set in your .env file
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// const S3_BUCKET = process.env.S3_BUCKET;

// // Configure Multer for file uploads using memory storage
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['.stl', '.step'];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowedTypes.includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only .stl and .step files are allowed.'));
//     }
//   },
// });

// // Socket.IO connection handler (optional)
// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

// // API Endpoints

// /**
//  * @route   POST /upload
//  * @desc    Handle file uploads
//  * @access  Public (Consider securing this endpoint)
//  */
// app.post('/upload', upload.single('file'), async (req, res) => {
//   const { session, orderId, originalName } = req.body;

//   console.log('Received upload request:', { session, orderId, originalName });

//   if (!session || !orderId || !originalName) {
//     return res.status(400).send('Missing session, orderId, or originalName');
//   }

//   // Ensure that a file is present
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }

//   // Generate a unique filename to prevent collisions
//   const uniqueFileName = `${Date.now()}-${path.basename(originalName)}`;

//   try {
//     // Initialize file data object
//     const fileData = {
//       orderId,
//       session,
//       name: uniqueFileName,
//       originalName: originalName,
//       url: '', // To be updated after S3 upload
//       buildVolume: 0,
//       dimensions: { length: 0, width: 0, height: 0 },
//       price: 0, // Initialize as needed
//       quantity: 1, // Default quantity
//     };

//     // If the uploaded file is an STL, extract dimensions and volume
//     if (originalName.toLowerCase().endsWith('.stl')) {
//       const tempFilePath = path.join(os.tmpdir(), uniqueFileName);
//       await fs.promises.writeFile(tempFilePath, req.file.buffer);
//       const stl = new STL(tempFilePath);
//       fileData.dimensions = {
//         length: stl.boundingBox[0],
//         width: stl.boundingBox[1],
//         height: stl.boundingBox[2],
//       };
//       fileData.buildVolume = stl.volume;
//       // Remove the temporary file
//       await unlinkFile(tempFilePath);
//     }

//     // Define S3 upload parameters using AWS SDK v3
//     const params = {
//       Bucket: S3_BUCKET,
//       Key: `uploads/${uniqueFileName}`, // File will be saved under 'uploads/' prefix in S3
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//       // ACL: 'public-read', // Removed due to bucket policy
//     };

//     // Upload the file to S3
//     const command = new PutObjectCommand(params);
//     await s3.send(command);

//     // Construct the S3 file URL
//     const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}`;
//     fileData.url = fileUrl;

//     // Save the file metadata to MongoDB
//     const newFile = new File(fileData);
//     await newFile.save();

//     // Update or create the order in MongoDB
//     let existingOrder = await Order.findOne({ orderId: orderId });

//     if (existingOrder) {
//       existingOrder.files.push(newFile._id);
//       await existingOrder.save();
//     } else {
//       existingOrder = new Order({
//         orderId,
//         session,
//         files: [newFile._id],
//         subtotal: 0,
//         gst: 0,
//         shippingCharges: 0,
//         total: 0,
//       });
//       await existingOrder.save();
//     }

//     // Emit a real-time event (optional)
//     io.emit('fileUploaded', { orderId, file: newFile });

//     // Retrieve updated files for the session
//     const updatedFiles = await File.find({ session: session });

//     res.status(201).json(updatedFiles);
//   } catch (err) {
//     console.error('Error during file upload:', err);
//     res.status(500).send(err.message);
//   }
// });

// /**
//  * @route   GET /files/:session
//  * @desc    Fetch files for a specific session
//  * @access  Public (Consider securing this endpoint)
//  */
// app.get('/files/:session', async (req, res) => {
//   const { session } = req.params;

//   try {
//     const files = await File.find({ session: session });
//     res.json(files);
//   } catch (err) {
//     console.error('Error fetching files:', err);
//     res.status(500).send(err.message);
//   }
// });

// /**
//  * @route   GET /orders/:orderId
//  * @desc    Fetch order details by orderId
//  * @access  Public (Consider securing this endpoint)
//  */
// app.get('/orders/:orderId', async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const order = await Order.findOne({ orderId: orderId }).populate('files');
//     if (!order) {
//       return res.status(404).send('Order not found');
//     }
//     res.json(order);
//   } catch (err) {
//     console.error('Error fetching order details:', err);
//     res.status(500).send('Error fetching order details: ' + err.message);
//   }
// });

// /**
//  * @route   PUT /orders/:orderId
//  * @desc    Update order details
//  * @access  Public (Consider securing this endpoint)
//  */
// app.put('/orders/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { files, subtotal, gst, shippingCharges, total } = req.body;

//   try {
//     // Find and update the order
//     const updatedOrder = await Order.findOneAndUpdate(
//       { orderId: orderId },
//       { files: files, subtotal, gst, shippingCharges, total },
//       { new: true }
//     ).populate('files');

//     if (!updatedOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // Emit a real-time event (optional)
//     io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

//     res.json(updatedOrder);
//   } catch (err) {
//     console.error('Error updating order:', err);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });

// /**
//  * @route   POST /submit-order
//  * @desc    Submit a new order
//  * @access  Public (Consider securing this endpoint)
//  */
// app.post('/submit-order', async (req, res) => {
//   const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;

//   console.log('Received submit order request:', { orderId, session, files, subtotal, gst, shippingCharges, total });

//   if (!orderId || !session) {
//     return res.status(400).send('Missing orderId or session');
//   }

//   try {
//     let existingOrder = await Order.findOne({ orderId: orderId });

//     if (existingOrder) {
//       // Update the existing order
//       existingOrder.files = files.map((file) => file._id);
//       existingOrder.subtotal = subtotal;
//       existingOrder.gst = gst;
//       existingOrder.shippingCharges = shippingCharges;
//       existingOrder.total = total;
//       await existingOrder.save();
//     } else {
//       // Create a new order
//       existingOrder = new Order({
//         orderId,
//         session,
//         files: files.map((file) => file._id),
//         subtotal,
//         gst,
//         shippingCharges,
//         total,
//       });
//       await existingOrder.save();
//     }

//     // Emit a real-time event (optional)
//     io.emit('orderSubmitted', { orderId: existingOrder.orderId, order: existingOrder });

//     res.status(201).send('Order submitted successfully');
//   } catch (err) {
//     console.error('Error submitting order:', err);
//     res.status(500).send('Error submitting order: ' + err.message);
//   }
// });

// // Submit a new order
// app.post('/submit-order', async (req, res) => {
//   try {
//     const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;
//     const existingOrder = await Order.findOne({ orderId: orderId });

//     // Use JSON.stringify to print the full structure of files, including options
//     console.log('Received submit order request:', JSON.stringify({ orderId, session, files, subtotal, gst, shippingCharges, total }, null, 2));

//     if (!orderId || !session) {
//       return res.status(400).send('Missing orderId or session');
//     }

//     if (existingOrder) {
//       existingOrder.files = files;
//       existingOrder.subtotal = subtotal;
//       existingOrder.gst = gst;
//       existingOrder.shippingCharges = shippingCharges;
//       existingOrder.total = total;
//       await existingOrder.save();
//     } else {
//       const newOrder = new Order({ orderId, session, files, subtotal, gst, shippingCharges, total });
//       await newOrder.save();
//     }

//     res.status(201).send('Order submitted successfully');
//   } catch (error) {
//     res.status(500).send('Error submitting order: ' + error.message);
//   }
// });


// /**
//  * @route   GET /orders
//  * @desc    Fetch all orders
//  * @access  Public (Consider securing this endpoint)
//  */
// app.get('/orders', async (req, res) => {
//   try {
//     const orders = await Order.find().populate('files');
//     res.json(orders);
//   } catch (err) {
//     console.error('Error fetching orders:', err);
//     res.status(500).send('Error fetching orders: ' + err.message);
//   }
// });

// /**
//  * @route   PUT /update-order/:orderId
//  * @desc    Update order with new files and recalculate totals
//  * @access  Public (Consider securing this endpoint)
//  */
// app.put('/update-order/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { newFiles } = req.body; // newFiles should be an array of file IDs

//   try {
//     const existingOrder = await Order.findOne({ orderId: orderId });

//     if (!existingOrder) {
//       return res.status(404).send('Order not found');
//     }

//     // Add new files to the existing order
//     existingOrder.files.push(...newFiles);

//     // Recalculate totals
//     const populatedOrder = await existingOrder.populate('files');
//     let subtotal = 0;

//     populatedOrder.files.forEach((file) => {
//       subtotal += file.price * file.quantity;
//     });

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal < 300 && subtotal > 0 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     existingOrder.subtotal = subtotal;
//     existingOrder.gst = gst;
//     existingOrder.shippingCharges = shippingCharges;
//     existingOrder.total = total;

//     await existingOrder.save();

//     // Emit a real-time event (optional)
//     io.emit('orderUpdated', { orderId: existingOrder.orderId, updatedOrder: existingOrder });

//     res.json(existingOrder);
//   } catch (err) {
//     console.error('Error updating order:', err);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });

// /**
//  * @route   GET /generate-presigned-url
//  * @desc    Generate a pre-signed URL for uploading or downloading a file
//  * @access  Public (Consider securing this endpoint)
//  * @query   operation: 'get' | 'put'
//  *          key: string (S3 object key)
//  */
// app.get('/generate-presigned-url', async (req, res) => {
//   const { operation, key } = req.query;

//   if (!operation || !key) {
//     return res.status(400).send('Missing operation or key query parameters');
//   }

//   try {
//     let command;
//     if (operation === 'put') {
//       command = new PutObjectCommand({
//         Bucket: S3_BUCKET,
//         Key: key,
//         ContentType: 'application/octet-stream', // Adjust as needed
//       });
//     } else if (operation === 'get') {
//       command = new GetObjectCommand({
//         Bucket: S3_BUCKET,
//         Key: key,
//       });
//     } else {
//       return res.status(400).send("Invalid operation. Use 'get' or 'put'.");
//     }

//     // Generate a pre-signed URL valid for 15 minutes
//     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

//     res.json({ url: signedUrl });
//   } catch (err) {
//     console.error('Error generating pre-signed URL:', err);
//     res.status(500).send('Error generating pre-signed URL');
//   }
// });

// /**
//  * @route   GET /options
//  * @desc    Fetch options for technology, material, color, quality, and density
//  * @access  Public (Consider securing this endpoint)
//  */
// app.get('/options', async (req, res) => {
//   try {
//     const optionsData = {
//       technologyOptions: {
//         SLS: {
//           material: ['Nylon 2200'],
//           color: ['Default'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         SLA: {
//           material: ['ABS', 'Clear Resin', 'Translucent'],
//           color: ['White'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         MJF: {
//           material: ['Nylon PA12'],
//           color: ['Grey'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         DLP: {
//           material: ['Green Castable Resin'],
//           color: ['Green'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         MJP: {
//           material: ['White/Clear Resin'],
//           color: ['White/Clear'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         PJP: {
//           material: ['Clear Resin', 'Agilus 30'],
//           color: ['Clear'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         'FDM/FFF': {
//           material: ['PLA', 'ABS', 'HIPS', 'Flexible', 'PET G', 'Copper', 'Brass', 'Wood', 'Marble'],
//           color: ['White', 'Black', 'Red', 'Grey', 'Green', 'Natural', 'Yellow'],
//           quality: ['Draft', 'High', 'Standard'],
//           density: ['20%', '30%', '50%', '100%'],
//         },
//       },
//       materialCosts: {
//         PLA: 2,
//         ABS: 3,
//         HIPS: 4,
//         Flexible: 5,
//         'PET G': 6,
//         Copper: 7,
//         Brass: 3,
//         Wood: 5,
//         Marble: 4,
//         'Clear Resin': 8,
//         Translucent: 6,
//         'Nylon PA12': 9,
//         'Green Castable Resin': 5,
//         'White/Clear': 5,
//         'Clear Resin': 6,
//         'Agilus 30': 3,
//       },
//       densityCosts: {
//         '20%': 2,
//         '30%': 3,
//         '50%': 4,
//         '100%': 5,
//       },
//       qualityCosts: {
//         Draft: 2,
//         Standard: 3,
//         High: 4,
//       },
//     };
//     res.json(optionsData);
//   } catch (err) {
//     console.error('Error fetching options data:', err);
//     res.status(500).send('Error fetching options data');
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// require('dotenv').config(); // Load environment variables from .env

// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const STL = require('node-stl');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');
// const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const fs = require('fs');
// const os = require('os');
// const util = require('util');

// // Promisify unlink for easier async/await usage
// const unlinkFile = util.promisify(fs.unlink);

// // Initialize Express app
// const app = express();
// const server = http.createServer(app);

// // Configure Socket.IO (if real-time updates are needed)
// const io = socketIo(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3002'], // Update with your client origins
//     methods: ['GET', 'POST'],
//   },
// });

// // CORS middleware setup
// const corsOptions = {
//   origin: ['http://localhost:3000', 'http://localhost:3002'], // Update with your client origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.json());

// // Connect to MongoDB without deprecated options
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Define Mongoose Schemas and Models

// // File Schema
// const fileSchema = new mongoose.Schema({
//   orderId: { type: String, required: true },
//   session: { type: String, required: true },
//   name: { type: String, required: true }, // Unique file name
//   originalName: { type: String, required: true }, // Original file name
//   url: { type: String, required: true }, // S3 URL
//   buildVolume: { type: Number, default: 0 }, // Volume extracted from STL
//   dimensions: {
//     length: { type: Number, default: 0 },
//     width: { type: Number, default: 0 },
//     height: { type: Number, default: 0 },
//   },
//   price: { type: Number, default: 0 },
//   quantity: { type: Number, default: 1 },
//   options: { type: Object, default: {} }, // Store options as an object
// });

// const File = mongoose.model('File', fileSchema);

// // Order Schema
// const orderSchema = new mongoose.Schema({
//   orderId: { type: String, required: true, unique: true },
//   session: { type: String, required: true },
//   files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
//   subtotal: { type: Number, default: 0 },
//   gst: { type: Number, default: 0 },
//   shippingCharges: { type: Number, default: 0 },
//   total: { type: Number, default: 0 },
// });

// const Order = mongoose.model('Order', orderSchema);

// // Configure AWS S3 Client (AWS SDK v3)
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });
// const S3_BUCKET = process.env.S3_BUCKET;

// // Configure Multer for file uploads using memory storage
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['.stl', '.step'];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowedTypes.includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only .stl and .step files are allowed.'));
//     }
//   },
// });

// // Socket.IO connection handler (optional)
// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//   });
// });

// // API Endpoints

// /**
//  * @route   POST /upload
//  * @desc    Handle file uploads
//  * @access  Public (Consider securing this endpoint)
//  */
// app.post('/upload', upload.single('file'), async (req, res) => {
//   const { session, orderId, originalName } = req.body;

//   console.log('Received upload request:', { session, orderId, originalName });

//   if (!session || !orderId || !originalName) {
//     return res.status(400).send('Missing session, orderId, or originalName');
//   }

//   // Ensure that a file is present
//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }

//   // Generate a unique filename to prevent collisions
//   const uniqueFileName = `${Date.now()}-${path.basename(originalName)}`;

//   try {
//     // Initialize file data object
//     const fileData = {
//       orderId,
//       session,
//       name: uniqueFileName,
//       originalName: originalName,
//       url: '', // To be updated after S3 upload
//       buildVolume: 0,
//       dimensions: { length: 0, width: 0, height: 0 },
//       price: 0, // Initialize as needed
//       quantity: 1, // Default quantity
//       options: {}, // Initialize options
//     };

//     // If the uploaded file is an STL, extract dimensions and volume
//     // If the uploaded file is an STL, extract dimensions and volume
//     if (originalName.toLowerCase().endsWith('.stl')) {
//       const tempFilePath = path.join(os.tmpdir(), uniqueFileName);
//       await fs.promises.writeFile(tempFilePath, req.file.buffer);
//       const stl = new STL(tempFilePath);
//       fileData.dimensions = {
//         length: stl.boundingBox[0],
//         width: stl.boundingBox[1],
//         height: stl.boundingBox[2],
//       };
//       fileData.buildVolume = stl.volume;
//       // Remove the temporary file
//       await unlinkFile(tempFilePath);
//     }


//     // Define S3 upload parameters using AWS SDK v3
//     const params = {
//       Bucket: S3_BUCKET,
//       Key: `uploads/${uniqueFileName}`, // File will be saved under 'uploads/' prefix in S3
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//     };

//     // Upload the file to S3
//     const command = new PutObjectCommand(params);
//     await s3.send(command);

//     // Construct the S3 file URL
//     const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}`;
//     fileData.url = fileUrl;

//     // Save the file metadata to MongoDB
//     const newFile = new File(fileData);
//     await newFile.save();

//     // Update or create the order in MongoDB
//     let existingOrder = await Order.findOne({ orderId: orderId });

//     if (existingOrder) {
//       existingOrder.files.push(newFile._id);
//       await existingOrder.save();
//     } else {
//       existingOrder = new Order({
//         orderId,
//         session,
//         files: [newFile._id],
//         subtotal: 0,
//         gst: 0,
//         shippingCharges: 0,
//         total: 0,
//       });
//       await existingOrder.save();
//     }

//     // Emit a real-time event (optional)
//     io.emit('fileUploaded', { orderId, file: newFile });

//     // Retrieve updated files for the session
//     const updatedFiles = await File.find({ session: session });

//     res.status(201).json(updatedFiles);
//   } catch (err) {
//     console.error('Error during file upload:', err);
//     res.status(500).send(err.message);
//   }
// });

// /**
//  * @route   POST /submit-order
//  * @desc    Submit a new order
//  * @access  Public (Consider securing this endpoint)
//  */
// app.post('/submit-order', async (req, res) => {
//   try {
//     const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;

//     console.log('Received submit order request:', JSON.stringify(req.body, null, 2));

//     if (!orderId || !session || !files) {
//       return res.status(400).send('Missing orderId, session, or files');
//     }

//     // Process each file to include options values
//     const fileIds = await Promise.all(
//       files.map(async (file) => {
//         const existingFile = await File.findById(file._id);
//         if (!existingFile) {
//           throw new Error('File not found');
//         }
//         return existingFile._id; // Store the file ID
//       })
//     );

//     let existingOrder = await Order.findOne({ orderId: orderId });

//     if (existingOrder) {
//       existingOrder.files = fileIds;
//       existingOrder.subtotal = subtotal || existingOrder.subtotal;
//       existingOrder.gst = gst || existingOrder.gst;
//       existingOrder.shippingCharges = shippingCharges || existingOrder.shippingCharges;
//       existingOrder.total = total || existingOrder.total;
//       await existingOrder.save();
//     } else {
//       const newOrder = new Order({
//         orderId,
//         session,
//         files: fileIds,
//         subtotal,
//         gst,
//         shippingCharges,
//         total,
//       });
//       await newOrder.save();
//     }

//     res.status(200).send('Order submitted successfully');
//   } catch (err) {
//     console.error('Error during order submission:', err);
//     res.status(500).send(err.message);
//   }
// });


// /**
//  * @route   GET /files/:session
//  * @desc    Fetch files for a specific session
//  * @access  Public (Consider securing this endpoint)
//  */
// app.get('/files/:session', async (req, res) => {
//   const { session } = req.params;

//   try {
//     const files = await File.find({ session: session });
//     res.json(files);
//   } catch (err) {
//     console.error('Error fetching files:', err);
//     res.status(500).send(err.message);
//   }
// });

// /**
//  * @route   GET /orders/:orderId
//  * @desc    Fetch order details by orderId
//  * @access  Public (Consider securing this endpoint)
//  */
// app.get('/orders/:orderId', async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const order = await Order.findOne({ orderId: orderId }).populate('files');
//     if (!order) {
//       return res.status(404).send('Order not found');
//     }
//     res.json(order);
//   } catch (err) {
//     console.error('Error fetching order details:', err);
//     res.status(500).send('Error fetching order details: ' + err.message);
//   }
// });

// /**
//  * @route   PUT /orders/:orderId
//  * @desc    Update order details
//  * @access  Public (Consider securing this endpoint)
//  */
// app.put('/orders/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { files, subtotal, gst, shippingCharges, total } = req.body;

//   try {
//     // Find and update the order
//     const updatedOrder = await Order.findOneAndUpdate(
//       { orderId: orderId },
//       { files: files, subtotal, gst, shippingCharges, total },
//       { new: true }
//     ).populate('files');

//     if (!updatedOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // Emit a real-time event (optional)
//     io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

//     res.json(updatedOrder);
//   } catch (err) {
//     console.error('Error updating order:', err);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });

// /**
//  * @route   GET /orders
//  * @desc    Fetch all orders
//  * @access  Public (Consider securing this endpoint)
//  */
// app.get('/orders', async (req, res) => {
//   try {
//     const orders = await Order.find().populate('files');
//     res.json(orders);
//   } catch (err) {
//     console.error('Error fetching orders:', err);
//     res.status(500).send('Error fetching orders: ' + err.message);
//   }
// });

// /**
//  * @route   PUT /update-order/:orderId
//  * @desc    Update order with new files and recalculate totals
//  * @access  Public (Consider securing this endpoint)
//  */
// app.put('/update-order/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { newFiles } = req.body; // newFiles should be an array of file IDs

//   try {
//     const existingOrder = await Order.findOne({ orderId: orderId });

//     if (!existingOrder) {
//       return res.status(404).send('Order not found');
//     }

//     // Add new files to the existing order
//     existingOrder.files.push(...newFiles);

//     // Recalculate totals
//     const populatedOrder = await existingOrder.populate('files');
//     let subtotal = 0;

//     populatedOrder.files.forEach((file) => {
//       subtotal += file.price * file.quantity;
//     });

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal < 300 && subtotal > 0 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     existingOrder.subtotal = subtotal;
//     existingOrder.gst = gst;
//     existingOrder.shippingCharges = shippingCharges;
//     existingOrder.total = total;

//     await existingOrder.save();

//     // Emit a real-time event (optional)
//     io.emit('orderUpdated', { orderId: existingOrder.orderId, updatedOrder: existingOrder });

//     res.json(existingOrder);
//   } catch (err) {
//     console.error('Error updating order:', err);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });

// /**
//  * @route   GET /generate-presigned-url
//  * @desc    Generate a pre-signed URL for uploading or downloading a file
//  * @access  Public (Consider securing this endpoint)
//  * @query   operation: 'get' | 'put'
//  *          key: string (S3 object key)
//  */
// app.get('/generate-presigned-url', async (req, res) => {
//   const { operation, key } = req.query;

//   if (!operation || !key) {
//     return res.status(400).send('Missing operation or key query parameters');
//   }

//   try {
//     let command;
//     if (operation === 'put') {
//       command = new PutObjectCommand({
//         Bucket: S3_BUCKET,
//         Key: key,
//         ContentType: 'application/octet-stream', // Adjust as needed
//       });
//     } else if (operation === 'get') {
//       command = new GetObjectCommand({
//         Bucket: S3_BUCKET,
//         Key: key,
//       });
//     } else {
//       return res.status(400).send("Invalid operation. Use 'get' or 'put'.");
//     }

//     // Generate a pre-signed URL valid for 15 minutes
//     const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

//     res.json({ url: signedUrl });
//   } catch (err) {
//     console.error('Error generating pre-signed URL:', err);
//     res.status(500).send('Error generating pre-signed URL');
//   }
// });

// /**
//  * @route   GET /options
//  * @desc    Fetch options for technology, material, color, quality, and density
//  * @access  Public (Consider securing this endpoint)
//  */
// app.get('/options', async (req, res) => {
//   try {
//     const optionsData = {
//       technologyOptions: {
//         SLS: {
//           material: ['Nylon 2200'],
//           color: ['Default'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         SLA: {
//           material: ['ABS', 'Clear Resin', 'Translucent'],
//           color: ['White'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         MJF: {
//           material: ['Nylon PA12'],
//           color: ['Grey'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         DLP: {
//           material: ['Green Castable Resin'],
//           color: ['Green'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         MJP: {
//           material: ['White/Clear Resin'],
//           color: ['White/Clear'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         PJP: {
//           material: ['Clear Resin', 'Agilus 30'],
//           color: ['Clear'],
//           quality: ['Default'],
//           density: ['Default'],
//         },
//         'FDM/FFF': {
//           material: ['PLA', 'ABS', 'HIPS', 'Flexible', 'PET G', 'Copper', 'Brass', 'Wood', 'Marble'],
//           color: ['White', 'Black', 'Red', 'Grey', 'Green', 'Natural', 'Yellow'],
//           quality: ['Draft', 'High', 'Standard'],
//           density: ['20%', '30%', '50%', '100%'],
//         },
//       },
//       materialCosts: {
//         PLA: 2,
//         ABS: 3,
//         HIPS: 4,
//         Flexible: 5,
//         'PET G': 6,
//         Copper: 7,
//         Brass: 3,
//         Wood: 5,
//         Marble: 4,
//         'Clear Resin': 8,
//         Translucent: 6,
//         'Nylon PA12': 9,
//         'Green Castable Resin': 5,
//         'White/Clear': 5,
//         'Clear Resin': 6,
//         'Agilus 30': 3,
//       },
//       densityCosts: {
//         '20%': 2,
//         '30%': 3,
//         '50%': 4,
//         '100%': 5,
//       },
//       qualityCosts: {
//         Draft: 2,
//         Standard: 3,
//         High: 4,
//       },
//     };
//     res.json(optionsData);
//   } catch (err) {
//     console.error('Error fetching options data:', err);
//     res.status(500).send('Error fetching options data');
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });




// server.js

require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const STL = require('node-stl');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const os = require('os');
const util = require('util');

// Promisify unlink for easier async/await usage
const unlinkFile = util.promisify(fs.unlink);

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.IO (if real-time updates are needed)
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3002'], // Update with your client origins
    methods: ['GET', 'POST'],
  },
});

// CORS middleware setup
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3002'], // Update with your client origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB without deprecated options
mongoose
  .connect(process.env.MONGODB_URI, {
    // Use the new URL parser and unified topology by default in Mongoose 6+
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose Schemas and Models

// // File Schema
// const fileSchema = new mongoose.Schema({
//   orderId: { type: String, required: true },
//   session: { type: String, required: true },
//   name: { type: String, required: true }, // Unique file name
//   originalName: { type: String, required: true }, // Original file name
//   url: { type: String, required: true }, // S3 URL
//   buildVolume: { type: Number, default: 0 }, // Volume extracted from STL
//   dimensions: {
//     length: { type: Number, default: 0 },
//     width: { type: Number, default: 0 },
//     height: { type: Number, default: 0 },
//   },
// });

// const File = mongoose.model('File', fileSchema);

// // Order Schema
// const orderSchema = new mongoose.Schema({
//   orderId: { type: String, required: true, unique: true },
//   session: { type: String, required: true },
//   files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
//   subtotal: { type: Number, default: 0 },
//   gst: { type: Number, default: 0 },
//   shippingCharges: { type: Number, default: 0 },
//   total: { type: Number, default: 0 },
// });



// const Order = mongoose.model('Order', orderSchema);

const fileSchema = new mongoose.Schema({
  orderId: String,
  session: String,
  name: String,
  originalName: String,
  url: String,
  buildVolume: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
});

const File = mongoose.model('File', fileSchema);

const orderSchema = new mongoose.Schema({
  orderId: String,
  session: String,
  files: Array,
  subtotal: Number,
  gst: Number,
  shippingCharges: Number,
  total: Number,
});

const Order = mongoose.model('Order', orderSchema);

// Configure AWS S3 Client (AWS SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION, // Ensure this is set in your .env file
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const S3_BUCKET = process.env.S3_BUCKET;

// Configure Multer for file uploads using memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.stl', '.step'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .stl and .step files are allowed.'));
    }
  },
});

// Socket.IO connection handler (optional)
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Endpoints

/**
 * @route   POST /upload
 * @desc    Handle file uploads
 * @access  Public (Consider securing this endpoint)
 */
app.post('/upload', upload.single('file'), async (req, res) => {
  const { session, orderId, originalName } = req.body;

  console.log('Received upload request:', { session, orderId, originalName });

  if (!session || !orderId || !originalName) {
    return res.status(400).send('Missing session, orderId, or originalName');
  }

  // Ensure that a file is present
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Generate a unique filename to prevent collisions
  const uniqueFileName = `${Date.now()}-${path.basename(originalName)}`;

  try {
    // Initialize file data object
    const fileData = {
      orderId,
      session,
      name: uniqueFileName,
      originalName: originalName,
      url: '', // To be updated after S3 upload
      buildVolume: 0,
      dimensions: { length: 0, width: 0, height: 0 },
    };

    // If the uploaded file is an STL, extract dimensions and volume
    if (originalName.toLowerCase().endsWith('.stl')) {
      const tempFilePath = path.join(os.tmpdir(), uniqueFileName);
      await fs.promises.writeFile(tempFilePath, req.file.buffer);
      const stl = new STL(tempFilePath);
      fileData.dimensions = {
        length: stl.boundingBox[0],
        width: stl.boundingBox[1],
        height: stl.boundingBox[2],
      };
      fileData.buildVolume = stl.volume;
      // Remove the temporary file
      await unlinkFile(tempFilePath);
    }

    // Define S3 upload parameters using AWS SDK v3
    const params = {
      Bucket: S3_BUCKET,
      Key: `uploads/${uniqueFileName}`, // File will be saved under 'uploads/' prefix in S3
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      // ACL: 'public-read', // Removed due to bucket policy
    };

    // Upload the file to S3
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Construct the S3 file URL
    const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}`;
    fileData.url = fileUrl;

    // Save the file metadata to MongoDB
    const newFile = new File(fileData);
    await newFile.save();

    // Update or create the order in MongoDB
    let existingOrder = await Order.findOne({ orderId: orderId });

    if (existingOrder) {
      existingOrder.files.push(newFile._id);
      await existingOrder.save();
    } else {
      existingOrder = new Order({
        orderId,
        session,
        files: [fileData],
        subtotal: 0,
        gst: 0,
        shippingCharges: 0,
        total: 0,
      });
      await existingOrder.save();
    }

    // Emit a real-time event (optional)
    io.emit('fileUploaded', { orderId, file: newFile });

    // Retrieve updated files for the session
    const updatedFiles = await File.find({ session: session });

    res.status(201).json(updatedFiles);
  } catch (err) {
    console.error('Error during file upload:', err);
    res.status(500).send(err.message);
  }
});

/**
 * @route   GET /files/:session
 * @desc    Fetch files for a specific session
 * @access  Public (Consider securing this endpoint)
 */
app.get('/files/:session', async (req, res) => {
  const { session } = req.params;

  try {
    const files = await File.find({ session: session });
    res.json(files);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).send(err.message);
  }
});

/**
 * @route   GET /orders/:orderId
 * @desc    Fetch order details by orderId
 * @access  Public (Consider securing this endpoint)
 */
app.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId: orderId }).populate('files');
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.json(order);
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).send('Error fetching order details: ' + err.message);
  }
});

/**
 * @route   PUT /orders/:orderId
 * @desc    Update order details
 * @access  Public (Consider securing this endpoint)
 */
// app.put('/orders/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { files, subtotal, gst, shippingCharges, total } = req.body;

//   try {
//     // Find and update the order
//     const updatedOrder = await Order.findOneAndUpdate(
//       { orderId: orderId },
//       { files: files, subtotal, gst, shippingCharges, total },
//       { new: true }
//     ).populate('files');

//     if (!updatedOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // Emit a real-time event (optional)
//     io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

//     res.json(updatedOrder);
//   } catch (err) {
//     console.error('Error updating order:', err);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });

// Update order details
app.put('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { files } = req.body;

  try {
    const updatedFiles = files.map(file => ({
      ...file,
      itemTotal: file.itemTotal || 0,
      customPrice: file.customPrice,
    }));

    // Calculate subtotal based on itemTotal for all files
    const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

    // Calculate gst and shipping charges
    const gst = Math.round(subtotal * 0.18);
    const shippingCharges = 0;
    const total = Math.round(subtotal + gst + shippingCharges);

    // Update the order with the recalculated values
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { files: updatedFiles, subtotal, gst, shippingCharges, total },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    io.emit('orderUpdated', { orderId: updatedOrder.orderId, updatedOrder });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

/**
 * @route   POST /submit-order
 * @desc    Submit a new order
 * @access  Public (Consider securing this endpoint)
 */
// app.post('/submit-order', async (req, res) => {
//   const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;

//   console.log('Received submit order request:', { orderId, session, files, subtotal, gst, shippingCharges, total });

//   if (!orderId || !session) {
//     return res.status(400).send('Missing orderId or session');
//   }

//   try {
//     let existingOrder = await Order.findOne({ orderId: orderId });

//     if (existingOrder) {
//       // Update the existing order
//       existingOrder.files = files.map((file) => file._id);
//       existingOrder.subtotal = subtotal;
//       existingOrder.gst = gst;
//       existingOrder.shippingCharges = shippingCharges;
//       existingOrder.total = total;
//       await existingOrder.save();
//     } else {
//       // Create a new order
//       existingOrder = new Order({
//         orderId,
//         session,
//         files: files.map((file) => file._id),
//         subtotal,
//         gst,
//         shippingCharges,
//         total,
//       });
//       await existingOrder.save();
//     }

//     // Emit a real-time event (optional)
//     io.emit('orderSubmitted', { orderId: existingOrder.orderId, order: existingOrder });

//     res.status(201).send('Order submitted successfully');
//   } catch (err) {
//     console.error('Error submitting order:', err);
//     res.status(500).send('Error submitting order: ' + err.message);
//   }
// });

// Submit a new order
app.post('/submit-order', async (req, res) => {
  try {
    const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;
    const existingOrder = await Order.findOne({ orderId: orderId });

    console.log('Received submit order request:', { orderId, session, files, subtotal, gst, shippingCharges, total });

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
    // Emit a real-time event (optional)
    io.emit('orderSubmitted', { orderId: existingOrder.orderId, order: existingOrder });
    res.status(201).send('Order submitted successfully');
  } catch (error) {
    res.status(500).send('Error submitting order: ' + error.message);
  }
});

// // Submit a new order
// app.post('/submit-order', async (req, res) => {
//   try {
//     const { orderId, session, files, subtotal, gst, shippingCharges, total } = req.body;
//     const existingOrder = await Order.findOne({ orderId: orderId });

//     // Use JSON.stringify to print the full structure of files, including options
//     console.log('Received submit order request:', JSON.stringify({ orderId, session, files, subtotal, gst, shippingCharges, total }, null, 2));

//     if (!orderId || !session) {
//       return res.status(400).send('Missing orderId or session');
//     }

//     if (existingOrder) {
//       existingOrder.files = files;
//       existingOrder.subtotal = subtotal;
//       existingOrder.gst = gst;
//       existingOrder.shippingCharges = shippingCharges;
//       existingOrder.total = total;
//       await existingOrder.save();
//     } else {
//       const newOrder = new Order({ orderId, session, files, subtotal, gst, shippingCharges, total });
//       await newOrder.save();
//     }

//     res.status(201).send('Order submitted successfully');
//   } catch (error) {
//     res.status(500).send('Error submitting order: ' + error.message);
//   }
// });


/**
 * @route   GET /orders
 * @desc    Fetch all orders
 * @access  Public (Consider securing this endpoint)
 */
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('files');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Error fetching orders: ' + err.message);
  }
});

/**
 * @route   PUT /update-order/:orderId
 * @desc    Update order with new files and recalculate totals
 * @access  Public (Consider securing this endpoint)
 */
// app.put('/update-order/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { newFiles } = req.body; // newFiles should be an array of file IDs

//   try {
//     const existingOrder = await Order.findOne({ orderId: orderId });

//     if (!existingOrder) {
//       return res.status(404).send('Order not found');
//     }

//     // Add new files to the existing order
//     existingOrder.files.push(...newFiles);

//     // Recalculate totals
//     const populatedOrder = await existingOrder.populate('files');
//     let subtotal = 0;

//     populatedOrder.files.forEach((file) => {
//       subtotal += file.price * file.quantity;
//     });

//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal < 300 && subtotal > 0 ? 50 : 0;
//     const total = subtotal + gst + shippingCharges;

//     existingOrder.subtotal = subtotal;
//     existingOrder.gst = gst;
//     existingOrder.shippingCharges = shippingCharges;
//     existingOrder.total = total;

//     await existingOrder.save();

//     // Emit a real-time event (optional)
//     io.emit('orderUpdated', { orderId: existingOrder.orderId, updatedOrder: existingOrder });

//     res.json(existingOrder);
//   } catch (err) {
//     console.error('Error updating order:', err);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });


// Update order with new files and recalculate totals
// app.put('/update-order/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { newFiles } = req.body;

//   try {
//     const existingOrder = await Order.findOne({ orderId: orderId });

//     if (!existingOrder) {
//       return res.status(404).send('Order not found');
//     }

//     const updatedFiles = [...existingOrder.files, ...newFiles];

//     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));
//     const gst = Math.round(subtotal * 0.18);
//     const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;
//     const total = Math.round(subtotal + gst + shippingCharges);

//     existingOrder.files = updatedFiles;
//     existingOrder.subtotal = subtotal;
//     existingOrder.gst = gst;
//     existingOrder.shippingCharges = shippingCharges;
//     existingOrder.total = total;

//     await existingOrder.save();

//     io.emit('orderUpdated', { orderId: existingOrder.orderId, updatedOrder: existingOrder });
//     res.json(existingOrder);
//   } catch (error) {
//     console.error('Error updating order:', error);
//     res.status(500).json({ error: 'Failed to update order' });
//   }
// });

// Update order with new files and recalculate totals
app.put('/update-order/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { newFiles } = req.body; // new files to be added

  try {
    const existingOrder = await Order.findOne({ orderId: orderId });

    if (!existingOrder) {
      return res.status(404).send('Order not found');
    }

    // Add new files to the existing order
    const updatedFiles = [...existingOrder.files, ...newFiles];

    // Calculate subtotal based on itemTotal of all files
    const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.itemTotal || 0), 0));

    // Calculate GST (assuming GST rate is 18.1% of subtotal)
    const gst = Math.round(subtotal * 0.18);

    // Set shipping charges (assuming shipping charges are based on subtotal)
    const shippingCharges = subtotal === 0 ? 0 : subtotal < 300 ? 50 : 0;

    // Calculate total
    const total = Math.round(subtotal + gst + shippingCharges);

    // Update the order with the new files and recalculated values
    existingOrder.files = updatedFiles;
    existingOrder.subtotal = subtotal;
    existingOrder.gst = gst;
    existingOrder.shippingCharges = shippingCharges;
    existingOrder.total = total;

    await existingOrder.save();

    // Emit socket event to notify clients about order update
    io.emit('orderUpdated', { orderId: existingOrder.orderId, updatedOrder: existingOrder });

    res.json(existingOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});


/**
 * @route   GET /generate-presigned-url
 * @desc    Generate a pre-signed URL for uploading or downloading a file
 * @access  Public (Consider securing this endpoint)
 * @query   operation: 'get' | 'put'
 *          key: string (S3 object key)
 */
app.get('/generate-presigned-url', async (req, res) => {
  const { operation, key } = req.query;

  if (!operation || !key) {
    return res.status(400).send('Missing operation or key query parameters');
  }

  try {
    let command;
    if (operation === 'put') {
      command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ContentType: 'application/octet-stream', // Adjust as needed
      });
    } else if (operation === 'get') {
      command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });
    } else {
      return res.status(400).send("Invalid operation. Use 'get' or 'put'.");
    }

    // Generate a pre-signed URL valid for 15 minutes
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

    res.json({ url: signedUrl });
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    res.status(500).send('Error generating pre-signed URL');
  }
});

/**
 * @route   GET /options
 * @desc    Fetch options for technology, material, color, quality, and density
 * @access  Public (Consider securing this endpoint)
 */
app.get('/options', async (req, res) => {
  try {
    const optionsData = {
      technologyOptions: {
        SLS: {
          material: ['Nylon 2200'],
          color: ['Default'],
          quality: ['Default'],
          density: ['Default'],
        },
        SLA: {
          material: ['ABS', 'Clear Resin', 'Translucent'],
          color: ['White'],
          quality: ['Default'],
          density: ['Default'],
        },
        MJF: {
          material: ['Nylon PA12'],
          color: ['Grey'],
          quality: ['Default'],
          density: ['Default'],
        },
        DLP: {
          material: ['Green Castable Resin'],
          color: ['Green'],
          quality: ['Default'],
          density: ['Default'],
        },
        MJP: {
          material: ['White/Clear Resin'],
          color: ['White/Clear'],
          quality: ['Default'],
          density: ['Default'],
        },
        PJP: {
          material: ['Clear Resin', 'Agilus 30'],
          color: ['Clear'],
          quality: ['Default'],
          density: ['Default'],
        },
        'FDM/FFF': {
          material: ['PLA', 'ABS', 'HIPS', 'Flexible', 'PET G', 'Copper', 'Brass', 'Wood', 'Marble'],
          color: ['White', 'Black', 'Red', 'Grey', 'Green', 'Natural', 'Yellow'],
          quality: ['Draft', 'High', 'Standard'],
          density: ['20%', '30%', '50%', '100%'],
        },
      },
      materialCosts: {
        PLA: 2,
        ABS: 3,
        HIPS: 4,
        Flexible: 5,
        'PET G': 6,
        Copper: 7,
        Brass: 3,
        Wood: 5,
        Marble: 4,
        'Clear Resin': 8,
        Translucent: 6,
        'Nylon PA12': 9,
        'Green Castable Resin': 5,
        'White/Clear': 5,
        'Clear Resin': 6,
        'Agilus 30': 3,
      },
      densityCosts: {
        '20%': 2,
        '30%': 3,
        '50%': 4,
        '100%': 5,
      },
      qualityCosts: {
        Draft: 2,
        Standard: 3,
        High: 4,
      },
    };
    res.json(optionsData);
  } catch (err) {
    console.error('Error fetching options data:', err);
    res.status(500).send('Error fetching options data');
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
