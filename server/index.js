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
// // const io = socketIo(server);

// // app.use(bodyParser.json());
// // app.use(cors());

// // // Connect to MongoDB
// // mongoose.connect('mongodb://localhost:27017/myy-uploads');

// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const STL = require('node-stl');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// // const io = socketIo(server);

// const io = socketIo(server, {
//   cors: {
//     origin: ['http://localhost:3000', 'http://localhost:3002'],
//     methods: ['GET', 'POST'],
//   }
// });

// // CORS middleware setup
// const corsOptions = {
//   origin: ['http://localhost:3000', 'http://localhost:3002'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// };

// app.use(cors(corsOptions));


// app.use(bodyParser.json());
// // app.use(cors());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/myy-uploads');

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

// const orderSchema = new mongoose.Schema({
//   orderId: String,
//   session: String,
//   files: Array,
//   subtotal: Number,
//   gst: Number,
//   shippingCharges: Number,
//   total: Number,
// });

// const Order = mongoose.model('Order', orderSchema);

// // Set up Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({ storage });

// // Handle file uploads
// app.post('/upload', upload.single('file'), async (req, res) => {
//   const { session, orderId, originalName } = req.body;

//   console.log('Received upload request:', { session, orderId, originalName });

//   if (!session || !orderId) {
//     return res.status(400).send('Missing session or orderId');
//   }

//   const fileData = {
//     name: req.file.filename,
//     originalName: originalName,
//     url: req.file.path,
//     session: session,
//     orderId: orderId,
//   };

//   try {
//     if (req.file.originalname.endsWith('.stl')) {
//       const stl = new STL(req.file.path);
//       fileData.dimensions = {
//         length: stl.boundingBox[0],
//         width: stl.boundingBox[1],
//         height: stl.boundingBox[2],
//       };
//       fileData.buildVolume = stl.volume;
//     }

//     const existingOrder = await Order.findOne({ orderId: orderId });
//     if (existingOrder) {
//       existingOrder.files.push(fileData);
//       await existingOrder.save();
//     } else {
//       const newOrder = new Order({
//         orderId,
//         session,
//         files: [fileData],
//         subtotal: 0,
//         gst: 0,
//         shippingCharges: 0,
//         total: 0,
//       });
//       await newOrder.save();
//     }

//     await new File(fileData).save();
//     const updatedFiles = await File.find({ session: session });
//     res.status(201).json(updatedFiles);
//   } catch (err) {
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

// // // Update order details
// // app.put('/orders/:orderId', async (req, res) => {
// //   const { orderId } = req.params;
// //   const { files } = req.body;

// //   try {
// //     // Update each file in the order with customPrice if provided
// //     const updatedFiles = files.map(file => ({
// //       ...file,
// //       price: file.price || 0 // Use customPrice if provided, otherwise fallback to price
// //     }));

// //     // Calculate subtotal
// //     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.price || 0), 0));

// //     // Calculate gst (assuming gst rate is 18.1% of subtotal)
// //     const gst = Math.round(subtotal * 0.18);

// //     // Set shipping charges (assuming no shipping charges for this example)
// //     const shippingCharges = 0;

// //     // Calculate total
// //     const total = Math.round(subtotal + gst + shippingCharges)

// //     // Update the order with the updated files array and calculated values
// //     const updatedOrder = await Order.findOneAndUpdate(
// //       { orderId: orderId },  // Update query to use orderId
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

//     // Calculate gst (assuming gst rate is 18.1% of subtotal)
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

//     // Calculate GST (assuming GST rate is 18.1% of subtotal)
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

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// server.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });



const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const STL = require('node-stl');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/myy-uploads');
mongoose.connect('mongodb://ec2-13-239-3-234.ap-southeast-2.compute.amazonaws.com:27017/myy-uploads');

// Define Schema for uploaded files
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
app.post('/upload', upload.single('file'), async (req, res) => {
  const { session, orderId, originalName } = req.body;

  console.log('Received upload request:', { session, orderId, originalName });

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

// Enable GET request to fetch files for a specific session
app.get('/files/:session', async (req, res) => {
  try {
    const files = await File.find({ session: req.params.session });
    res.json(files);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Fetch order details by orderId
app.get('/orders/:orderId', async (req, res) => {
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

// // Update order details
// app.put('/orders/:orderId', async (req, res) => {
//   const { orderId } = req.params;
//   const { files } = req.body;

//   try {
//     // Update each file in the order with customPrice if provided
//     const updatedFiles = files.map(file => ({
//       ...file,
//       price: file.price || 0 // Use customPrice if provided, otherwise fallback to price
//     }));

//     // Calculate subtotal
//     const subtotal = Math.round(updatedFiles.reduce((acc, file) => acc + (file.price || 0), 0));

//     // Calculate gst (assuming gst rate is 18.1% of subtotal)
//     const gst = Math.round(subtotal * 0.18);

//     // Set shipping charges (assuming no shipping charges for this example)
//     const shippingCharges = 0;

//     // Calculate total
//     const total = Math.round(subtotal + gst + shippingCharges)

//     // Update the order with the updated files array and calculated values
//     const updatedOrder = await Order.findOneAndUpdate(
//       { orderId: orderId },  // Update query to use orderId
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

// Update order details
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

//     // Calculate gst (assuming gst rate is 18.1% of subtotal)
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

    res.status(201).send('Order submitted successfully');
  } catch (error) {
    res.status(500).send('Error submitting order: ' + error.message);
  }
});

// Fetch all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('files');
    res.json(orders);
  } catch (error) {
    res.status(500).send('Error fetching orders: ' + error.message);
  }
});

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


// Fetch options for technology, material, color, quality, and density
app.get('/options', async (req, res) => {
  try {
    const optionsData = {
      technologyOptions: {
        'SLS': {
          material: ['Nylon 2200'],
          color: ['Default'],
          quality: ['Default'],
          density: ['Default'],
        },
        'SLA': {
          material: ['ABS', 'Clear Resin', 'Translucent'],
          color: ['White'],
          quality: ['Default'],
          density: ['Default'],
        },
        'MJF': {
          material: ['Nylon PA12'],
          color: ['Grey'],
          quality: ['Default'],
          density: ['Default'],
        },
        'DLP': {
          material: ['Green Castable Resin'],
          color: ['Green'],
          quality: ['Default'],
          density: ['Default'],
        },
        'MJP': {
          material: ['White/Clear Resin'],
          color: ['White/Clear'],
          quality: ['Default'],
          density: ['Default'],
        },
        'PJP': {
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
        'PLA': 2,
        'ABS': 3,
        'HIPS': 4,
        'Flexible': 5,
        'PET G': 6,
        'Copper': 7,
      },
      densityCosts: {
        '20%': 2,
        '30%': 3,
        '50%': 4,
        '100%': 5,
      },
      qualityCosts: {
        'Draft': 2,
        'Standard': 3,
        'High': 4,
      },
    };
    res.json(optionsData);
  } catch (error) {
    console.error('Error fetching options data:', error);
    res.status(500).send('Error fetching options data');
  }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});