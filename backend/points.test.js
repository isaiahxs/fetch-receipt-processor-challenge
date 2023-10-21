const request = require('supertest');
const app = require('../app');
const { receipts } = require('./points');

const {
    pointsForRetailerName,
} = require('./points');

describe('Points calculation functions', () => {
    test('calculates points for retailer name', () => {
        expect(pointsForRetailerName('Target')).toBe(6);
        expect(pointsForRetailerName('Walmart')).toBe(7);
    })
})