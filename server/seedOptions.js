require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the Options Schema and Model
const optionsSchema = new mongoose.Schema({
  technologyOptions: Object,
  materialCosts: Object,
  densityCosts: Object,
  qualityCosts: Object,
});

const Options = mongoose.model('Options', optionsSchema);

// Options Data
// const optionsData = {
//   technologyOptions: {
//     SLS: {
//       material: ['Nylon 2200'],
//       color: ['Default'],
//       quality: ['Default'],
//       density: ['Default'],
//     },
//     SLA: {
//       material: ['ABS', 'Clear Resin', 'Translucent'],
//       color: ['White'],
//       quality: ['Default'],
//       density: ['Default'],
//     },
//     MJF: {
//       material: ['Nylon PA12'],
//       color: ['Grey'],
//       quality: ['Default'],
//       density: ['Default'],
//     },
//     DLP: {
//       material: ['Green Castable Resin'],
//       color: ['Green'],
//       quality: ['Default'],
//       density: ['Default'],
//     },
//     MJP: {
//       material: ['White/Clear Resin'],
//       color: ['White/Clear'],
//       quality: ['Default'],
//       density: ['Default'],
//     },
//     PJP: {
//       material: ['Clear Resin', 'Agilus 30'],
//       color: ['Clear'],
//       quality: ['Default'],
//       density: ['Default'],
//     },
//     'FDM/FFF': {
//       material: ['PLA', 'ABS', 'HIPS', 'Flexible', 'PET G', 'Copper', 'Brass', 'Wood', 'Marble'],
//       color: ['White', 'Black', 'Red', 'Grey', 'Green', 'Natural', 'Yellow'],
//       quality: ['Draft', 'High', 'Standard'],
//       density: ['20%', '30%', '50%', '100%'],
//     },
//   },
//   materialCosts: {
//     PLA: 2,
//     ABS: 3,
//     HIPS: 4,
//     Flexible: 5,
//     'PET G': 6,
//     Copper: 7,
//     Brass: 3,
//     Wood: 5,
//     Marble: 4,
//     'Clear Resin': 8,
//     Translucent: 6,
//     'Nylon PA12': 9,
//     'Green Castable Resin': 5,
//     'White/Clear': 5,
//     'Clear Resin': 6,
//     'Agilus 30': 3,
//   },
//   densityCosts: {
//     '20%': 2,
//     '30%': 3,
//     '50%': 4,
//     '100%': 5,
//   },
//   qualityCosts: {
//     Draft: 2,
//     Standard: 3,
//     High: 4,
//   },
// };
const optionsData = {
  technologyOptions: {
    SLS: {
      enabled: true,
      material: [{ name: 'Nylon 2200', enabled: true }],
      color: [{ name: 'Default', enabled: true }],
      quality: [{ name: 'Default', enabled: true }],
      density: [{ name: 'Default', enabled: true }],
    },
    SLA: {
      enabled: true,
      material: [
        { name: 'ABS', enabled: true },
        { name: 'Clear Resin', enabled: true },
        { name: 'Translucent', enabled: true },
      ],
      color: [{ name: 'White', enabled: true }],
      quality: [{ name: 'Default', enabled: true }],
      density: [{ name: 'Default', enabled: true }],
    },
    MJF: {
      enabled: true,
      material: [{ name: 'Nylon PA12', enabled: true }],
      color: [{ name: 'Grey', enabled: true }],
      quality: [{ name: 'Default', enabled: true }],
      density: [{ name: 'Default', enabled: true }],
    },
    DLP: {
      enabled: true,
      material: [{ name: 'Green Castable Resin', enabled: true }],
      color: [{ name: 'Green', enabled: true }],
      quality: [{ name: 'Default', enabled: true }],
      density: [{ name: 'Default', enabled: true }],
    },
    MJP: {
      enabled: true,
      material: [{ name: 'White/Clear Resin', enabled: true }],
      color: [{ name: 'White/Clear', enabled: true }],
      quality: [{ name: 'Default', enabled: true }],
      density: [{ name: 'Default', enabled: true }],
    },
    PJP: {
      enabled: true,
      material: [
        { name: 'Clear Resin', enabled: true },
        { name: 'Agilus 30', enabled: true },
      ],
      color: [{ name: 'Clear', enabled: true }],
      quality: [{ name: 'Default', enabled: true }],
      density: [{ name: 'Default', enabled: true }],
    },
    'FDM/FFF': {
      enabled: true,
      material: [
        { name: 'PLA', enabled: true },
        { name: 'ABS', enabled: true },
        { name: 'HIPS', enabled: true },
        { name: 'Flexible', enabled: true },
        { name: 'PET G', enabled: true },
        { name: 'Copper', enabled: true },
        { name: 'Brass', enabled: true },
        { name: 'Wood', enabled: true },
        { name: 'Marble', enabled: true },
      ],
      color: [
        { name: 'White', enabled: true },
        { name: 'Black', enabled: true },
        { name: 'Red', enabled: true },
        { name: 'Grey', enabled: true },
        { name: 'Green', enabled: true },
        { name: 'Natural', enabled: true },
        { name: 'Yellow', enabled: true },
      ],
      quality: [
        { name: 'Draft', enabled: true },
        { name: 'High', enabled: true },
        { name: 'Standard', enabled: true },
      ],
      density: [
        { name: '20%', enabled: true },
        { name: '30%', enabled: true },
        { name: '50%', enabled: true },
        { name: '100%', enabled: true },
      ],
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

// Insert Options into MongoDB
const seedOptions = async () => {
  try {
    await Options.deleteMany(); // Clear existing data
    await Options.create(optionsData); // Insert new data
    console.log('Options seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding options:', err);
    mongoose.connection.close();
  }
};

seedOptions();

// app.get('/options', async (req, res) => {
//   try {
//     const optionsData = {
//       technologyOptions: {
//         SLS: {
//           enabled: true, // Enable or disable this technology
//           material: [
//             { name: 'Nylon 2200', enabled: true },
//           ],
//           color: [
//             { name: 'Default', enabled: true },
//           ],
//           quality: [
//             { name: 'Default', enabled: true },
//           ],
//           density: [
//             { name: 'Default', enabled: true },
//           ],
//         },
//         SLA: {
//           enabled: true,
//           material: [
//             { name: 'ABS', enabled: true },
//             { name: 'Clear Resin', enabled: false }, // Disabled material
//             { name: 'Translucent', enabled: true },
//           ],
//           color: [
//             { name: 'White', enabled: true },
//           ],
//           quality: [
//             { name: 'Default', enabled: true },
//           ],
//           density: [
//             { name: 'Default', enabled: true },
//           ],
//         },
//         'FDM/FFF': {
//           enabled: true,
//           material: [
//             { name: 'PLA', enabled: true },
//             { name: 'ABS', enabled: false }, // Disabled material
//             { name: 'HIPS', enabled: true },
//           ],
//           color: [
//             { name: 'White', enabled: true },
//             { name: 'Black', enabled: false }, // Disabled color
//             { name: 'Red', enabled: true },
//           ],
//           quality: [
//             { name: 'Draft', enabled: true },
//             { name: 'High', enabled: true },
//             { name: 'Standard', enabled: true },
//           ],
//           density: [
//             { name: '20%', enabled: true },
//             { name: '30%', enabled: true },
//             { name: '50%', enabled: true },
//             { name: '100%', enabled: true },
//           ],
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