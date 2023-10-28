const request = require('supertest');
const app = require('../../app');
// const { receipts } = require('../Calculations/pointCalc');
const { receipts } = require('../Calculations/pointCalc');

const {
    calculateAndCachePoints
} = require('../Calculations/pointCalc');

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