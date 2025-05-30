require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose'); // Import mongoose
const User = require('./models/userModel'); // Adjust the path to your user model

const seedUsers = async () => {
  try {
    // Define the users to seed
    const users = [
      {
        name: 'P Kavitha',
        email: 'pontaganikavitha75@gmail.com',
        role: 'admin',
        allowed: true, // Allow admin to log in
      },
      {
        name: 'Kavitha P',
        email: 'kpontagani@gmail.com',
        role: 'user',
        allowed: true, // Allow this user to log in
      },
    ];

    // Insert users into the database
    for (const user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create(user);
        console.log(`User ${user.email} seeded successfully.`);
      } else {
        console.log(`User ${user.email} already exists.`);
      }
    }

    console.log('User seeding completed.');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    await seedUsers();
    mongoose.disconnect();
  })
  .catch((err) => console.error('MongoDB connection error:', err));