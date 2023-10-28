const {
    pointsForRetailerName,
    pointsForRoundTotal,
    pointsForMultipleOfQuarter,
    pointsForItemsCount,
    pointsForItemDescriptions,
    pointsForDay,
    pointsForTimeRange,
    calculatePoints,
} = require('../Calculations/pointCalc');

describe('Points calculation functions', () => {
    test('calculates points for retailer name', () => {
        expect(pointsForRetailerName('Target')).toBe(6);
        expect(pointsForRetailerName('Walmart')).toBe(7);
        expect(pointsForRetailerName('!Walmart')).toBe(7);
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
            { shortDescription: 'Pepsi - 12-0z', price: '1.25' },
            { shortDescription: 'Pepsi - 12-0z', price: '1.25' },
        ])).toBe(5);

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
            {
                shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
                price: "12.00"
            }
        ]
        expect(pointsForItemDescriptions(items)).toBe(3);

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

    test('calculates points based on time', () => {
        expect(pointsForTimeRange('08:00')).toBe(0);
        expect(pointsForTimeRange('10:00')).toBe(0);
        expect(pointsForTimeRange('12:00')).toBe(0);

        expect(pointsForTimeRange('13:59')).toBe(0);
        expect(pointsForTimeRange('16:00')).toBe(0);

        expect(pointsForTimeRange('14:00')).toBe(10);
        expect(pointsForTimeRange('15:00')).toBe(10);
        expect(pointsForTimeRange('15:59')).toBe(10);

        expect(pointsForTimeRange('25:00')).toBe(0);
    })

    test('calculates overall points correctly', () => {
        let receipt = {
            retailer: "Walgreens",
            purchaseDate: "2022-01-02",
            purchaseTime: "08:13",
            total: "2.65",
            items: [
                { shortDescription: "Pepsi - 12-oz", "price": "1.25" },
                { shortDescription: "Dasani", "price": "1.40" }
            ]
        }
        expect(calculatePoints(receipt)).toBe(15);

        receipt = {
            retailer: "Target",
            purchaseDate: "2022-01-02",
            purchaseTime: "13:13",
            total: "1.25",
            items: [
                { shortDescription: "Pepsi - 12-oz", "price": "1.25" }
            ]
        }
        expect(calculatePoints(receipt)).toBe(31);
    })
})