const mongoose = require('mongoose');

const DB = process.env.MONGODB_URI;
// console.log('DB--', DB);
mongoose
    .connect(DB)
    .then(() => {
        console.log('DB connection established');
    })
    .catch((err) => {
        console.log('DB CONNECTION FAILED');
        console.log('ERR: ', err);
    });