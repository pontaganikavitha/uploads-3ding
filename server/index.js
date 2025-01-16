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
    origin: ['http://13.236.37.235:3000', 'http://13.236.37.235:3002'], // Update with your client origins
    methods: ['GET', 'POST'],
  },
});



//CORS middleware setup
const corsOptions = {
  origin: ['http://13.236.37.235:3000', 'http://13.236.37.235:3002'], // Update with your client origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")))

// Connect to MongoDB without deprecated options
mongoose
  .connect(process.env.MONGODB_URI, {
    // Use the new URL parser and unified topology by default in Mongoose 6+
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose Schemas and Models
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
//         files: [fileData],
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


app.post('/upload', upload.single('file'), async (req, res) => {
  const { session, orderId, originalName } = req.body;

  console.log('Received upload request:', { session, orderId, originalName });

  if (!session || !orderId || !originalName) {
    return res.status(400).send('Missing session, orderId, or originalName');
  }

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const uniqueFileName = `${Date.now()}-${path.basename(originalName)}`;

  try {
    const fileData = {
      orderId,
      session,
      name: uniqueFileName,
      originalName,
      url: '',
      buildVolume: 0,
      dimensions: { length: 0, width: 0, height: 0 },
    };

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
      await unlinkFile(tempFilePath);
    }

    const params = {
      Bucket: S3_BUCKET,
      Key: `uploads/${uniqueFileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}`;
    fileData.url = fileUrl;

    const newFile = new File(fileData);
    await newFile.save();

    let existingOrder = await Order.findOne({ orderId });

    if (existingOrder) {
      // Prevent duplicating files
      const existingFiles = existingOrder.files.map(f => f.name);
      if (!existingFiles.includes(uniqueFileName)) {
        existingOrder.files.push(fileData);
      }
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
    }

    await existingOrder.save();

    io.emit('fileUploaded', { orderId, file: newFile });

    const updatedFiles = await File.find({ session });

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
 * @route   POST /submit-order
 * @desc    Submit a new order
 * @access  Public (Consider securing this endpoint)
 */

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
 * @route   PUT /orders/:orderId
 * @desc    Update order details
 * @access  Public (Consider securing this endpoint)
 */
app.put('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { files, subtotal, gst, shippingCharges, total } = req.body;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        files: files.map(file => ({
          ...file,
          itemTotal: file.itemTotal || 0,
          customPrice: file.customPrice,
        })),
        subtotal,
        gst,
        shippingCharges,
        total,
      },
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

const host = "0.0.0.0";
const port = process.env.port || 3001;
server.listen({ host, port }, () => {
  console.log(
    `[[${new Date().toLocaleTimeString()}] tus server listening at http://${host}:${port}`
  );
});
