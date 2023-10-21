const express = require('express');
const router = express.Router();
// For our unique identifiers. V4 UUIDs are random-based.
const { v4: uuidv4 } = require('uuid');

// Our in-memory storage for receipts
const receipts = {};

// Modularizing calculatePoints

// One point for every alphanumeric character in the retailer name
const pointsForRetailerName = (retailer) => retailer.replace(/[^a-zA-Z0-9]/g, '').length;

// 50 points if the total is a round dollar amound with no cents
const pointsForRoundTotal = (total) => parseFloat(total) % 1 === 0 ? 50 : 0;

// 25 points if the total is a multiple of 0.25
const pointsForMultipleOfQuarter = (total) => parseFloat(total) % 0.25 === 0 ? 25 : 0;

// 5 points for every two items on the receipt. Using Math.floor to ensure that only complete pairs contribute to the score.
const pointsForItemsCount = (items) => Math.floor(items.length / 2) * 5;

const pointsForItemDescriptions = (items) => {
    let points = 0;
    for (let item of items) {
        // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer
        const descriptionLength = item.shortDescription.trim().length;

        if (descriptionLength % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    }
    // The result is the number of points earned
    return points;
};

// 6 points if the day in the purchase date is odd
const pointsForDay = (purchaseDate) => {
    const day = parseInt(purchaseDate.split('-')[2]);
    return day % 2 === 1 ? 6 : 0;
}

//10 points if the time of purchase is after 2:00PM and before 4:00PM
const pointsForTimeRange = (purchaseTime) => {
    const time = purchaseTime.split(':').map(Number);
    return (time[0] >= 14 && time[0] < 16) ? 10 : 0;
};

// Now the main calculatePoints function becomes a composition of these smaller functions.
const calculatePoints = (receipt) => {
    let points = 0;

    points += pointsForRetailerName(receipt.retailer);

    points += pointsForRoundTotal(receipt.total);

    points += pointsForMultipleOfQuarter(receipt.total);

    points += pointsForItemsCount(receipt.items);

    points += pointsForItemDescriptions(receipt.items);

    points += pointsForDay(receipt.purchaseDate);

    points += pointsForTimeRange(receipt.purchaseTime);

    return points;
}

router.get('/test', (req, res) => {
    res.send('Test endpoint');
});

router.post(`/receipts/process`, (req, res) => {
    let errors = [];

    const { retailer, purchaseDate, purchaseTime, total, items } = req.body;

    // Validate that retailer name exists and is a string
    if (!retailer || typeof retailer !== 'string') {
        errors.push('Invalid retailer name. Must be a string.');
    }

    // Validate purchase date exists and is in correct format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!purchaseDate || !dateRegex.test(purchaseDate)) {
        errors.push('Invalid purchase date. Structure must be YYYY-MM-DD.');
    }

    // Check if date is valid
    const parsedDate = new Date(purchaseDate);
    if (isNaN(parsedDate.getTime()) || parsedDate.toISOString().split('T')[0] !== purchaseDate) {
        errors.push('Invalid purchase date. Please insert a valid date from the calendar year.');
    }

    // Validate purchase time exists and is in correct format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!purchaseTime || !timeRegex.test(purchaseTime)) {
        errors.push('Invalid purchase time. Structure must be HH:MM.');
    }

    // Validate total exists and is a valid number
    if (!total || isNaN(parseFloat(total))) {
        errors.push('Invalid total. Must be a valid number.');
    }

    // Validate items array exists and has at least one item in it
    if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push('Invalid items. Must be a non-empty array.');
    } else {
        // Validate individual items
        items.forEach((item, index) => {
            if (!item.shortDescription || typeof item.shortDescription !== 'string') {
                errors.push(`Invalid shortDescription for item at index ${index}. Please enter a valid string description for this item.`);
            }

            if (item.price === undefined || isNaN(parseFloat(item.price))) {
                errors.push(`Invalid price for item at index ${index}. Please enter a valid price number for this item.`);
            }
        })
    }

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

const calculateAndCachePoints = (id) => {
    if (receipts[id] && receipts[id].points === undefined) {
        receipts[id].points = calculatePoints(receipts[id]);
    }
    return receipts[id] ? receipts[id].points : null;
}

router.get(`/receipts/:id/points`, (req, res) => {
    const id = req.params.id;

    const points = calculateAndCachePoints(id);

    if (points === null) {
        return res.status(404).json({ error: 'Receipt not found.' });
    }

    res.json({ points });
})

module.exports.router = router;
module.exports.receipts = receipts;
module.exports.pointsForRetailerName = pointsForRetailerName;
module.exports.pointsForRoundTotal = pointsForRoundTotal;
module.exports.pointsForMultipleOfQuarter = pointsForMultipleOfQuarter;
module.exports.pointsForItemsCount = pointsForItemsCount;
module.exports.pointsForItemDescriptions = pointsForItemDescriptions;
module.exports.pointsForDay = pointsForDay;
module.exports.pointsForTimeRange = pointsForTimeRange;
module.exports.calculatePoints = calculatePoints;
module.exports.calculateAndCachePoints = calculateAndCachePoints;