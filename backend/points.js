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

module.exports.router = router;
module.exports.receipts = receipts;
module.exports.pointsForRetailerName = pointsForRetailerName;
module.exports.pointsForRoundTotal = pointsForRoundTotal;
module.exports.pointsForMultipleOfQuarter = pointsForMultipleOfQuarter;