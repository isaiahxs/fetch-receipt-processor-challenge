const request = require('supertest');
const app = require('../app');
const { receipts } = require('./points');

const {
    pointsForRetailerName,
    pointsForRoundTotal,
    pointsForMultipleOfQuarter
} = require('./points');
const { default: expect } = require('expect');

describe('Points calculation functions', () => {
    test('calculates points for retailer name', () => {
        expect(pointsForRetailerName('Target')).toBe(6);
        expect(pointsForRetailerName('Walmart')).toBe(7);
    });

    test('calculates points for rounded total', () => {
        expect(pointsForRoundTotal('1.00')).toBe(50);
        expect(pointsForRoundTotal('1.01')).toBe(0);
    });

    test('calculates multiple points for multiples of 0.25', () => {
        expect(pointsForMultipleOfQuarter('1.50')).toBe(25);
        expect(pointsForMultipleOfQuarter('1.25')).toBe(25);
        expect(pointsForMultipleOfQuarter('1.01')).toBe(0);
    });
})