const mongoose = require('mongoose');
const Technology = require('../models/Technology');
const Material = require('../models/Material');
const Color = require('../models/Color');
const Quality = require('../models/Quality');
const Density = require('../models/Density');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/uppy-uploads');

// Insert initial data
async function insertData() {
    await mongoose.connection.dropDatabase();

    const technologies = await Technology.insertMany([
        { name: 'FDM/FFF' },
        { name: 'SLA' },
        // Add more technologies as needed
    ]);

    await Material.insertMany([
        { technology: technologies[0]._id, name: 'PLA' },
        { technology: technologies[0]._id, name: 'ABS' },
        { technology: technologies[1]._id, name: 'Clear Resin' },
        // Add more materials as needed
    ]);

    await Color.insertMany([
        { name: 'White' },
        { name: 'Black' },
        // Add more colors as needed
    ]);

    await Quality.insertMany([
        { name: 'Draft' },
        { name: 'Standard' },
        { name: 'High' },
        // Add more qualities as needed
    ]);

    await Density.insertMany([
        { name: '20%' },
        { name: '50%' },
        { name: '100%' },
        // Add more densities as needed
    ]);

    console.log('Data inserted successfully');
    mongoose.connection.close();
}

insertData().catch(console.error);
