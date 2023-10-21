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
    pointsForTimeRange,
    calculatePoints,
    calculateAndCachePoints
} = require('./points');

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

    test('calculates points based on time', () => {
        expect(pointsForTimeRange('08:00')).toBe(0);
        expect(pointsForTimeRange('10:00')).toBe(0);
        expect(pointsForTimeRange('12:00')).toBe(0);

        expect(pointsForTimeRange('13:59')).toBe(0);
        expect(pointsForTimeRange('16:00')).toBe(0);

        expect(pointsForTimeRange('14:00')).toBe(10);
        expect(pointsForTimeRange('15:00')).toBe(10);
        expect(pointsForTimeRange('15:59')).toBe(10);
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

// Testing API endpoints
describe('POST /receipts/process', () => {
    it('should return 400 if retailer is not provided', async () => {
        const res = await request(app)
            .post('/receipts/process')
            .send({
                retailer: '',
                purchaseDate: '2022-12-31',
                purchaseTime: '12:34',
                total: '123.45',
                items: [
                    { shortDescription: 'item1', price: '1.23' },
                    { shortDescription: 'item2', price: '4.56' }
                ]
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid purchase date', async () => {
        const res = await request(app)
            .post('/receipts/process')
            .send({ retailer: 'Walmart', purchaseDate: 'invalid-date' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid purchase time', async () => {
        const res = await request(app)
            .post('/receipts/process')
            .send({ retailer: 'Walmart', purchaseDate: '2023-01-01', purchaseTime: 'invalid-time' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toContain('Invalid purchase time. Structure must be HH:MM.');
    });

    it('should return 400 for invalid total', async () => {
        const res = await request(app)
            .post('/receipts/process')
            .send({ retailer: 'Walmart', purchaseDate: '2023-01-01', purchaseTime: '12:34', total: 'invalid-total' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toContain('Invalid total. Must be a valid number.');
    });

    it('should return 400 for invalid items', async () => {
        const res = await request(app)
            .post('/receipts/process')
            .send({
                retailer: 'Walmart',
                purchaseDate: '2023-01-01',
                purchaseTime: '12:34',
                total: '123.45'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toContain('Invalid items. Must be a non-empty array.');
    });

    it('should successfully process a valid receipt', async () => {
        const validReceipt = {
            retailer: 'Walmart',
            purchaseDate: '2023-10-11',
            purchaseTime: '14:00',
            total: 100.0,
            items: [
                { shortDescription: 'item1', price: 50 },
                { shortDescription: 'item2', price: 50 },
            ],
        };

        const response = await request(app)
            .post('/receipts/process')
            .send(validReceipt);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });
});

describe('GET /receipts/:id/points', () => {
    const validId = 'valid-id';
    const invalidId = 'invalid-id';

    beforeAll(() => {
        receipts[validId] = {
            retailer: 'Walmart',
            purchaseDate: '2023-10-11',
            purchaseTime: '14:00',
            total: 100.0,
            items: [
                { shortDescription: 'item1', price: '50' },
                { shortDescription: 'item2', price: '50' },
            ],
        };
        receipts[validId].points = calculateAndCachePoints(validId);
    });

    afterAll(() => {
        delete receipts[validId];
    });

    it('should return points for a valid receipt id', async () => {
        const response = await request(app).get(`/receipts/${validId}/points`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('points');
    })

    it('should return 404 for an invalid receipt id', async () => {
        const response = await request(app).get(`/receipts/${invalidId}/points`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Receipt not found.');
    })
})