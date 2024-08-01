const express = require('express');
const File = require('../models/file');
const router = express.Router();

// Enable GET request to fetch files for a specific session
router.get('/:session', async (req, res) => {
    try {
        const files = await File.find({ session: req.params.session });
        res.json(files);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
