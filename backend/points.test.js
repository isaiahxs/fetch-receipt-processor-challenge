const request = require('supertest');
const app = require('../app');
const { receipts } = require('./points');

const {
    pointsForRetailerName,
    pointsForRoundTotal,
    pointsForMultipleOfQuarter,
    pointsForItemsCount,
    pointsForItemDescriptions,
    pointsForDay,
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

    test('calculates points for every two items', () => {
        expect(pointsForItemsCount([
            { shortDescription: 'Pepsi - 12-0z', price: '1.25' },
            { shortDescription: 'Dasani', price: '1.40' }
        ])).toBe(5);

        expect(pointsForItemsCount([
            { shortDescription: 'Pepsi - 12-0z', price: '1.25' },
        ])).toBe(0);

        expect(pointsForItemsCount([
            { shortDescription: 'Pepsi - 12-0z', price: '1.25' },
            { shortDescription: 'Dasani', price: '1.40' },
            { shortDescription: 'Pepsi - 12-0z', price: '1.25' },
            { shortDescription: 'Dasani', price: '1.40' }
        ])).toBe(10);
    })

    test('calculates points for item descriptions', () => {
        let items = [
            { shortDescription: 'Dasani', price: '1.40' }, // 6 characters, 1 point
            { shortDescription: 'Pepsi', price: '1.25' } // 5 characters, 0 points
        ]
        expect(pointsForItemDescriptions(items)).toBe(1);

        items = [
            { shortDescription: 'Water', price: '1.00' }, // 5 characters, 0 points
            { shortDescription: 'Tea', price: '1.25' } // 3 characters, 1 point
        ]
        expect(pointsForItemDescriptions(items)).toBe(1);

        items = [
            { shortDescription: 'Water', price: '1.00' }, // 5 characters, 0 points
            { shortDescription: 'Teas', price: '1.35' } // 4 characters, 0 points
        ]
        expect(pointsForItemDescriptions(items)).toBe(0);

        items = []
        expect(pointsForItemDescriptions(items)).toBe(0);
    })

    test('calculates points based on day', () => {
        expect(pointsForDay('2022-01-01')).toBe(6);
        expect(pointsForDay('2022-01-03')).toBe(6);
        expect(pointsForDay('2022-01-05')).toBe(6);

        expect(pointsForDay('2022-01-02')).toBe(0);
        expect(pointsForDay('2022-01-04')).toBe(0);
        expect(pointsForDay('2022-01-06')).toBe(0);

        expect(pointsForDay('2025-12-01')).toBe(6);
        expect(pointsForDay('2025-12-02')).toBe(0);
    })

})