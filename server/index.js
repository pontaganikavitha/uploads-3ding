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
const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const os = require('os');
const util = require('util');
const THREE = require('three');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const archiver = require('archiver'); // For creating ZIP files
const UPLOADS_DIR = path.join(__dirname, 'uploads'); // Adjust if your upload path is different

const crypto = require("crypto");

const User = require('./models/userModel'); // Adjust the path to your user model


require('./models/dbConnect');


// Promisify unlink for easier async/await usage
const unlinkFile = util.promisify(fs.unlink);

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.IO (if real-time updates are needed)
const io = socketIo(server, {
  cors: {
    origin: ['https://test1.3ding.in, https://test1.3ding.in/admin'], // Update with your client origins
    methods: ['GET', 'POST'],
  },
});



//CORS middleware setup
const corsOptions = {
  origin: ['https://test1.3ding.in, https://test1.3ding.in/admin'], // Update with your client origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client/build")))

const authRoutes = require('./routes/authRoutes');
// app.use((req, res, next) => {
//   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
//   next();
// });

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups'); // Allow popups to interact with the parent window
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Keep COEP for security
  next();
});


// Connect to MongoDB without deprecated options
mongoose
  .connect(process.env.MONGODB_URI, {
    // Use the new URL parser and unified topology by default in Mongoose 6+
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose Schemas and Models
const fileSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  session: { type: String, required: true },
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  buildVolume: { type: Number, required: true },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
});

const File = mongoose.model('File', fileSchema);

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  session: { type: String, required: true },
  files: { type: Array, required: true },
  subtotal: { type: Number, required: true },
  gst: { type: Number, required: true },
  shippingCharges: { type: Number, required: true },
  total: { type: Number, required: true },
  leadTime: { type: String, required: true },
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
    const allowedTypes = ['.stl', '.step', '.obj', '.stp'];
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
    } else if (originalName.toLowerCase().endsWith('.obj')) {
      const tempFilePath = path.join(os.tmpdir(), uniqueFileName);
      await fs.promises.writeFile(tempFilePath, req.file.buffer);
      const { length, width, height, volume } = await calculateDimensionsAndVolumeFromOBJ(req.file.buffer);
      fileData.dimensions = { length, width, height };
      fileData.buildVolume = volume;
      await unlinkFile(tempFilePath);
    }

    async function calculateDimensionsAndVolumeFromOBJ(buffer) {
      const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');
      return new Promise((resolve, reject) => {
        try {
          const loader = new OBJLoader();
          const object = loader.parse(buffer.toString());
          const box = new THREE.Box3().setFromObject(object);
          const dimensions = {
            length: box.max.x - box.min.x,
            width: box.max.y - box.min.y,
            height: box.max.z - box.min.z,
          };
          let volume = 0;
          object.traverse((child) => {
            if (child.isMesh) {
              const geometry = child.geometry;
              geometry.computeBoundingBox();
              if (geometry.isBufferGeometry) {
                const position = geometry.attributes.position.array;
                for (let i = 0; i < position.length; i += 9) {
                  const v0 = new THREE.Vector3(position[i], position[i + 1], position[i + 2]);
                  const v1 = new THREE.Vector3(position[i + 3], position[i + 4], position[i + 5]);
                  const v2 = new THREE.Vector3(position[i + 6], position[i + 7], position[i + 8]);
                  volume += v0.dot(v1.cross(v2)) / 6.0;
                }
              }
            }
          });
          volume = Math.abs(volume);
          const volumeInCm3 = volume / 1000;
          resolve({
            length: dimensions.length.toFixed(2),
            width: dimensions.width.toFixed(2),
            height: dimensions.height.toFixed(2),
            volume: volumeInCm3.toFixed(2),
          });
        } catch (err) {
          reject(err);
        }
      });
    }

    const params = {
      Bucket: S3_BUCKET,
      Key: `orders/${orderId}/${uniqueFileName}`, // Store files under 'orders/{orderId}/' prefix
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/orders/${orderId}/${uniqueFileName}`;
    fileData.url = fileUrl;

    const newFile = new File(fileData);
    await newFile.save();

    let existingOrder = await Order.findOne({ orderId });

    if (existingOrder) {
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
        leadTime: 0,
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


// app.put('/allow-user/:email', async (req, res) => {
//   const { email } = req.params;

//   try {
//     const user = await User.findOneAndUpdate(
//       { email },
//       { allowed: true },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "User allowed successfully", user });
//   } catch (err) {
//     console.error("Error allowing user:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

app.post('/admin/add-user', async (req, res) => {
  const { name, email, role, allowed } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      role: role || 'user', // Default role is 'user'
      allowed: allowed || false, // Default is not allowed
    });

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// app.put('/allow-user/:email', async (req, res) => {
//   const { email } = req.params;

//   try {
//     const user = await User.findOneAndUpdate(
//       { email: email.toLowerCase() }, // Normalize email to lowercase
//       { allowed: true },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "User allowed successfully", user });
//   } catch (err) {
//     console.error("Error allowing user:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// app.put('/allow-user/:email', async (req, res) => {
//   const { email } = req.params;

//   try {
//     const user = await User.findOneAndUpdate(
//       { email: email.toLowerCase() }, // Normalize email to lowercase
//       { allowed: true },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("User allowed status updated:", user); // Debug log

//     res.status(200).json({ message: "User allowed successfully", user });
//   } catch (err) {
//     console.error("Error allowing user:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// app.post('/admin/add-user', async (req, res) => {
//   const { name, email, role, allowed } = req.body;

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create a new user
//     const newUser = await User.create({
//       name,
//       email: email.toLowerCase(), // Normalize email to lowercase
//       role: role || 'user', // Default role is 'user'
//       allowed: allowed !== undefined ? allowed : true, // Default is allowed
//     });

//     res.status(201).json({ message: 'User added successfully', user: newUser });
//   } catch (err) {
//     console.error('Error adding user:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// app.post('/admin/add-user', async (req, res) => {
//   const { name, email, role, allowed } = req.body;

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create a new user
//     const newUser = await User.create({
//       name,
//       email: email.toLowerCase(), // Normalize email to lowercase
//       role: role || 'user', // Default role is 'user'
//       allowed: allowed !== undefined ? allowed : true, // Default is allowed
//     });

//     console.log("New user added:", newUser); // Debug log

//     res.status(201).json({ message: 'User added successfully', user: newUser });
//   } catch (err) {
//     console.error('Error adding user:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

app.get('/download/order/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch list of files from S3 under the given orderId folder
    const data = await s3.send(new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: `orders/${orderId}/` // Use the 'orders/{orderId}/' prefix
    }));

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ error: 'No files found for this order.' });
    }

    // Set response headers for ZIP download
    res.setHeader('Content-Disposition', `attachment; filename=${orderId}.zip`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    // Add each file to the ZIP
    for (const file of data.Contents) {
      const fileData = await s3.send(new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: file.Key
      }));

      archive.append(fileData.Body, { name: file.Key.split('/').pop() });
    }

    archive.finalize();
  } catch (error) {
    console.error('Error creating ZIP:', error);
    res.status(500).json({ error: 'Failed to create ZIP' });
  }
});

// Updated download route
app.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Extract filename from database
    const fileKey = file.fileName || file.url.split('/').pop();
    const s3Url = `https://my-uploads-new.s3.ap-southeast-2.amazonaws.com/uploads/${fileKey}`;

    console.log("Redirecting to S3 URL:", s3Url);
    return res.redirect(s3Url);
  } catch (err) {
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
    const { orderId, session, files, subtotal, gst, shippingCharges, total, leadTime } = req.body;
    const existingOrder = await Order.findOne({ orderId: orderId });

    console.log('Received submit order request:', { orderId, session, files, subtotal, gst, shippingCharges, total, leadTime });

    if (!orderId || !session) {
      return res.status(400).send('Missing orderId or session');
    }

    if (existingOrder) {
      existingOrder.files = files;
      existingOrder.subtotal = subtotal;
      existingOrder.gst = gst;
      existingOrder.shippingCharges = shippingCharges;
      existingOrder.total = total;
      existingOrder.leadTime = leadTime;
      await existingOrder.save();
    } else {
      const newOrder = new Order({ orderId, session, files, subtotal, gst, shippingCharges, total, leadTime });
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
  const { files, subtotal, gst, shippingCharges, total, leadTime } = req.body;

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
        leadTime
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

// const UserSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['admin', 'user'], default: 'user' },
//   lastLogin: { type: Date } // ✅ Store last login timestamp
// });

// const User = mongoose.model('User', UserSchema);

// Middleware for authentication
// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ message: 'Access denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token' });
//   }
// };

// app.get('/users', authMiddleware, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const users = await User.find({}, 'email role lastLogin'); // ✅ Include lastLogin

//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// Create a new user (Admin only)
// app.post('/users', authMiddleware, async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

//   const { email, password, role } = req.body;
//   const existingUser = await User.findOne({ email });
//   if (existingUser) return res.status(400).json({ message: 'User already exists' });

//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = new User({ email, password: hashedPassword, role });
//   await newUser.save();
//   res.json({ message: 'User created' });
// });

// Delete user (Admin only)
// app.delete('/users/:id', authMiddleware, async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).json({ message: 'User not found' });
//   if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete an admin user' });

//   await User.findByIdAndDelete(req.params.id);
//   res.json({ message: 'User deleted' });
// });

// app.put('/users/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // For unexpected errors
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
});

app.use('/auth/', authRoutes); // <- NEW LINE



// New route to download an individual file from an order
app.get('/download/order/:orderId/:fileName', async (req, res) => {
  try {
    const { orderId, fileName } = req.params;

    // Fetch the order from the database
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the file exists in the order
    const file = order.files.find(file => file.name === fileName);
    if (!file) {
      return res.status(404).json({ error: 'File not found in order' });
    }

    // Generate the S3 file key
    const fileKey = `orders/${orderId}/${fileName}`;
    const s3Url = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    console.log("Redirecting to S3 URL:", s3Url);
    return res.redirect(s3Url);
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).send(err.message);
  }
});


app.get('/download/order/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch list of files from S3 under the given orderId folder
    const data = await s3.send(new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: `${orderId}/`
    }));

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ error: 'No files found for this order.' });
    }

    // Set response headers for ZIP download
    res.setHeader('Content-Disposition', `attachment; filename=${orderId}.zip`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    // Add each file to the ZIP
    for (const file of data.Contents) {
      const fileData = await s3.send(new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: file.Key
      }));

      archive.append(fileData.Body, { name: file.Key.split('/').pop() });
    }

    archive.finalize();
  } catch (error) {
    console.error('Error creating ZIP:', error);
    res.status(500).json({ error: 'Failed to create ZIP' });
  }
});

const { DeleteObjectCommand } = require('@aws-sdk/client-s3'); // Import S3 delete command

const { ObjectId } = mongoose.Types; // Import ObjectId from Mongoose

app.delete('/orders/:orderId/files/:fileId', async (req, res) => {
  const { orderId, fileId } = req.params;
  const { fileName } = req.body;

  try {
    // Convert fileId to ObjectId if necessary
    const objectId = ObjectId.isValid(fileId) ? new ObjectId(fileId) : null;
    if (!objectId) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }

    // Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the file in the order
    const fileIndex = order.files.findIndex((file) => file._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found in order' });
    }

    // Remove the file from the order
    const [removedFile] = order.files.splice(fileIndex, 1);
    await order.save();

    // Delete the file from the database
    await File.findByIdAndDelete(objectId);

    // Delete the file from S3
    const fileKey = `orders/${orderId}/${fileName}`;
    const deleteParams = {
      Bucket: S3_BUCKET,
      Key: fileKey,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

/**
 * @route   GET /options
 * @desc    Fetch options for technology, material, color, quality, and density
 * @access  Public (Consider securing this endpoint)
 */
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


// Define the Options Schema
const optionsSchema = new mongoose.Schema({
  technologyOptions: Object,
  materialCosts: Object,
  densityCosts: Object,
  qualityCosts: Object,
});

// Create the Options Model
const Options = mongoose.model('Options', optionsSchema);

/**
 * @route   GET /options
 * @desc    Fetch options for technology, material, color, quality, and density
 * @access  Public
 */
// app.get('/options', async (req, res) => {
//   try {
//     const options = await Options.findOne(); // Fetch the first document
//     if (!options) {
//       return res.status(404).json({ message: 'Options not found' });
//     }
//     res.json(options);
//   } catch (err) {
//     console.error('Error fetching options:', err);
//     res.status(500).send('Error fetching options');
//   }
// });

// app.get('/options', async (req, res) => {
//   try {
//     const options = await Options.findOne(); // Fetch options from the database
//     if (!options) {
//       return res.status(404).json({ message: 'Options not found' });
//     }

//     // Filter out disabled technologies, materials, colors, etc.
//     const filteredOptions = {
//       technologyOptions: Object.fromEntries(
//         Object.entries(options.technologyOptions)
//           .filter(([key, value]) => value.enabled) // Only include enabled technologies
//           .map(([key, value]) => [
//             key,
//             {
//               ...value,
//               material: value.material.filter((m) => m.enabled), // Filter enabled materials
//               color: value.color.filter((c) => c.enabled), // Filter enabled colors
//               quality: value.quality.filter((q) => q.enabled), // Filter enabled qualities
//               density: value.density.filter((d) => d.enabled), // Filter enabled densities
//             },
//           ])
//       ),
//       materialCosts: options.materialCosts,
//       densityCosts: options.densityCosts,
//       qualityCosts: options.qualityCosts,
//     };

//     res.json(filteredOptions);
//   } catch (err) {
//     console.error('Error fetching options:', err);
//     res.status(500).send('Error fetching options');
//   }
// });

app.get('/options', async (req, res) => {
  try {
    const options = await Options.findOne(); // Fetch options from the database

    if (!options) {
      return res.status(404).json({ message: 'Options not found' });
    }

    // Directly send all active options (since you store only active ones)
    const cleanOptions = {
      technologyOptions: options.technologyOptions,
      materialCosts: options.materialCosts,
      densityCosts: options.densityCosts,
      qualityCosts: options.qualityCosts,
    };

    res.json(cleanOptions);
  } catch (err) {
    console.error('Error fetching options:', err);
    res.status(500).send('Error fetching options');
  }
});


const host = "0.0.0.0";
const port = process.env.port || 3001;
server.listen({ host, port }, () => {
  console.log(
    `[[${new Date().toLocaleTimeString()}] tus server listening at http://${host}:${port}`
  );
});
