const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        methods: ['GET', 'POST'],
    },
});

// Middleware setup
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myy-uploads');

// Import routes
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');
const fileRoutes = require('./routes/fileRoutes');
const optionsRoutes = require('./routes/optionsRoutes');

// Use routes
app.use('/upload', uploadRoutes);
app.use('/orders', orderRoutes);
app.use('/files', fileRoutes);
app.use('/options', optionsRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
