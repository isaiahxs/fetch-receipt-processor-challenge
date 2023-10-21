const express = require('express');
const router = express.Router();
// For our unique identifiers. V4 UUIDs are random-based.
const { v4: uuidv4 } = require('uuid');

// Our in-memory storage for receipts
const receipts = {};

// Modularizing calculatePoints

// One point for every alphanumeric character in the retailer name
const pointsForRetailerName = (retailer) => retailer.replace(/[^a-zA-Z0-9]/g, '').length;

module.exports.router = router;
module.exports.receipts = receipts;
module.exports.pointsForRetailerName = pointsForRetailerName;