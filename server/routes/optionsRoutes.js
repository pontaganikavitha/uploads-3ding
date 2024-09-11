const express = require('express');
const router = express.Router();

// Fetch options for technology, material, color, quality, and density
router.get('/', async (req, res) => {
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
                'FDM': {
                    material: ['PLA', 'ABS'],
                    color: ['White', 'Red', 'Blue'],
                    quality: ['Low', 'Medium', 'High'],
                    density: ['Default'],
                },
                'MJF': {
                    material: ['PA 12'],
                    color: ['Black'],
                    quality: ['Default'],
                    density: ['Default'],
                },
                'DMLS': {
                    material: ['Stainless Steel 316L'],
                    color: ['Raw'],
                    quality: ['Default'],
                    density: ['Default'],
                },
            },
            price: {
                'SLS': 1.2,
                'SLA': 1.5,
                'FDM': 0.5,
                'MJF': 2.0,
                'DMLS': 5.0,
            },
        };

        res.json(optionsData);
    } catch (err) {
        res.status(500).send('Error fetching options data: ' + err.message);
    }
});

module.exports = router;
