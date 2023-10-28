const express = require('express');
const router = express.Router();
// For our unique identifiers. V4 UUIDs are random-based.
const { v4: uuidv4 } = require('uuid');
const { calculateAndCachePoints, receipts } = require('../Calculations/pointCalc');
const { validateReceiptData } = require('./validators');

router.get('/test', (req, res) => {
    res.send('Test endpoint');
});

router.post(`/receipts/process`, (req, res) => {
    const errors = validateReceiptData(req.body);

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Generate a unique ID from uuidv4
    const id = uuidv4();

    // Store the receipt in memory with the generated ID
    receipts[id] = req.body;

    // Respond with the generated ID
    res.json({ id });
});

router.get(`/receipts/:id/points`, (req, res) => {
    const id = req.params.id;

    const points = calculateAndCachePoints(id);

    if (points === null) {
        return res.status(404).json({ error: 'Receipt not found.' });
    }

    res.json({ points });
})

module.exports = {
    router
}