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
const THREE = require('three');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Promisify unlink for easier async/await usage
const unlinkFile = util.promisify(fs.unlink);

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.IO (if real-time updates are needed)
const io = socketIo(server, {
  cors: {
    origin: ['http://test1.3ding.in, http://test1.3ding.in/admin'], // Update with your client origins
    methods: ['GET', 'POST'],
  },
});

//CORS middleware setup
const corsOptions = {
  origin: ['http://test1.3ding.in, http://test1.3ding.in/admin'], // Update with your client origins
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
      // Handle STL file dimensions and volume
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
      // Handle OBJ file dimensions and volume
      const tempFilePath = path.join(os.tmpdir(), uniqueFileName);
      await fs.promises.writeFile(tempFilePath, req.file.buffer);

      // Calculate dimensions and volume for OBJ
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

          // Compute bounding box dimensions
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
              geometry.computeBoundingBox(); // Ensure bounding box exists

              if (geometry.isBufferGeometry) {
                const position = geometry.attributes.position.array;

                for (let i = 0; i < position.length; i += 9) {
                  const v0 = new THREE.Vector3(position[i], position[i + 1], position[i + 2]);
                  const v1 = new THREE.Vector3(position[i + 3], position[i + 4], position[i + 5]);
                  const v2 = new THREE.Vector3(position[i + 6], position[i + 7], position[i + 8]);

                  // Compute signed volume of the tetrahedron formed with the origin
                  volume += v0.dot(v1.cross(v2)) / 6.0;
                }
              }
            }
          });

          volume = Math.abs(volume); // Convert to absolute volume

          // 🔹 Convert mm³ to cm³
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

    // Upload file to S3
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

    // Save file data in the database
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


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  lastLogin: { type: Date } // ✅ Store last login timestamp
});

const User = mongoose.model('User', UserSchema);

// Middleware for authentication
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Ensure at least one administrator exists
const ensureAdminExists = async () => {
  const admins = [
    { email: "admin2@example.com", password: "admin123" } // Add another admin email
  ];

  try {
    for (const admin of admins) {
      const existingAdmin = await User.findOne({ email: admin.email });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        await new User({
          email: admin.email,
          password: hashedPassword,
          role: "admin",
        }).save();
        console.log(`Admin ${admin.email} created`);
      } else {
        console.log(`Admin ${admin.email} already exists`);
      }
    }
  } catch (error) {
    console.error("Error ensuring admin existence:", error);
  }
};

ensureAdminExists();


// Admin login
app.post('/login', async (req, res) => {
  console.log('Login API hit');

  const { email, password } = req.body;
  console.log('Received:', email, password); // Should print plain text password

  if (!email || !password) {
    console.log('Missing credentials');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found');
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  console.log('Stored hashed password:', user.password); // Log stored hash

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Password mismatch');
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Login successful:', user.email);

  // ✅ Update last login timestamp
  user.lastLogin = new Date();
  await user.save();

  res.json({ token, role: user.role });
});


// Get all users (Admin only)
app.get('/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({}, 'email role lastLogin'); // ✅ Include lastLogin

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Create a new user (Admin only)
app.post('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const { email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword, role });
  await newUser.save();
  res.json({ message: 'User created' });
});

// Delete user (Admin only)
app.delete('/users/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete an admin user' });

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
