const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const { app, server } = require('../server/server');
const connectDb = require('../server/models/dbHelper');
const {
    order1,
    order2,
    badOrderMissingRequiredTimestamp
} = require('./helpers/apiOrderHelper');

describe('GET /', () => {
    it('responds with 200 status and text/html content type', () => {
        return request(app)
            .get('/')
            .expect('Content-Type', /text\/html/)
            .expect(200);
    });
}
);

describe('/orders', () => {
    let db;
    beforeAll(async () => {
        db = await MongoMemoryServer.create();
        const db_uri = db.getUri();
        connectDb(db_uri);
    });

    afterEach(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany();
        }
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await db.stop();
        server.close();
    });

    describe('/schemaKeys', () => {
        it('responds with 200 status and non-empty values', () => {
            return request(app)
                .get('/orders/schemaKeys')
                .expect(200)
                .expect(res => {
                    const body = res.body;
                    if (!Object.values(body).every(array => array.length > 0)) {
                        throw new Error(`Response contain empty values: ${body}`);
                    }
                });
        });
    })

    describe('GET orders', () => {
        beforeEach(async () => {
            await request(app).post('/orders').send(order1);
            await request(app).post('/orders').send(order2);
        })

        it('/ responds with 200 status and retrieves all orders',
            async () => {
                const res = await request(app).get('/orders');
                expect(res.status).toEqual(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(2);
                expect(res.body[0].firstName).toEqual(order1.firstName);
            }
        );

        it('/name responds with 200 status and retrieves correct order with firstName only',
            async () => {
                const res = await request(app).get('/orders/name').query({ firstName: order2.firstName });
                expect(res.status).toEqual(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(1);
                expect(res.body[0].firstName).toEqual(order2.firstName);
            }
        );

        it('/name responds with 200 status and retrieves correct order with lastName only',
            async () => {
                const res = await request(app).get('/orders/name').query({ lastName: order1.lastName });
                expect(res.status).toEqual(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(1);
                expect(res.body[0].lastName).toEqual(order1.lastName);
            }
        );

        it('/name responds with 200 status and retrieves correct order with first and last names',
            async () => {
                const res = await request(app)
                    .get('/orders/name')
                    .query({ firstName: order1.firstName, lastName: order1.lastName });
                expect(res.status).toEqual(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(1);
                expect(res.body[0].firstName).toEqual(order1.firstName);
                expect(res.body[0].lastName).toEqual(order1.lastName);
            }
        );

        it('/name with empty query parameter responds with 500 status', () => {
            return request(app)
                .get('/orders/name')
                .expect(500, { err: 'An error occurred in ordersController.getOrders' });
        }
        );

        it('/name with no entries in database responds with 500 status', () => {
            return request(app)
                .get('/orders/name')
                .query({ firstName: 'foo', lastName: 'bar' })
                .expect(500, { err: 'An error occurred in ordersController.getOrders' });
        }
        );
    });

    describe('POST', () => {
        it('responds with 200 status', () => {
            return request(app)
                .post('/orders')
                .send(order1)
                .expect(200)
                .expect((res) => {
                    if (!res.body.id) {
                        throw new Error(`Expected database ID not found in response body.`);
                    }
                })
        });

        it('payload missing required field values responds with 500 status', () => {
            return request(app)
                .post('/orders')
                .send(badOrderMissingRequiredTimestamp)
                .expect(500, { err: 'An error occurred in ordersController.createOrder' });
        });
    });

    describe('DELETE', () => {
        let expectedOrderID;

        beforeEach(async () => {
            await request(app).post('/orders').send(order1);
            const order2Response = await request(app).post('/orders').send(order2);
            expectedOrderID = order2Response.body.id;
        })

        it('responds with 200 status', async () => {
            const deletionRespose = await request(app).delete('/orders').query({ id: expectedOrderID });
            expect(deletionRespose.status).toBe(200);
            expect(deletionRespose.body.id).toEqual(expectedOrderID);
        });

        it('ID with no entry responds with 200 status (no-op)', async () => {
            return request(app)
                .delete('/orders')
                .query({ id: new mongoose.Types.ObjectId().toString() })
                .expect(200);
        });

        it('missing id parameter responds with 500 status', () => {
            return request(app)
                .delete('/orders')
                .expect(500, { err: 'An error occurred in ordersController.deleteOrder' });
        });
    });
}
);