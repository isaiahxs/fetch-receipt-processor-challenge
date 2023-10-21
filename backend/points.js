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


module.exports.router = router;
module.exports.receipts = receipts;
module.exports.pointsForRetailerName = pointsForRetailerName;
module.exports.pointsForRoundTotal = pointsForRoundTotal;
module.exports.pointsForMultipleOfQuarter = pointsForMultipleOfQuarter;
module.exports.pointsForItemsCount = pointsForItemsCount;
module.exports.pointsForItemDescriptions = pointsForItemDescriptions;
module.exports.pointsForDay = pointsForDay;