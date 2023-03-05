process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const {createData, getCompany, getInvoice} = require('../testUtils');

afterAll(async () => {
    await db.end();
});

describe('invoices routing tests', () => {

    let ibm, inv1, inv2;
    beforeEach(async () => {
        await createData();
        [ibm, inv1, inv2] = await Promise.all([getCompany('ibm'), getInvoice(1), getInvoice(2)]);
    });

    test('get all invoices', async () => {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toEqual(200);

        const invoices = response.body.invoices;
        expect(invoices.length).toEqual(2);
        
        for (const inv of [{comp_code: inv1.comp_code, id: inv1.id}, {comp_code: inv2.comp_code, id: inv2.id}]) {
            expect(invoices).toContainEqual(inv);
        }
    });

    test('get single invoice', async () => {
        const response = await request(app).get(`/invoices/${inv1.id}`).send();
        expect(response.statusCode).toEqual(200);

        expect(response.body).toEqual({
            invoice: {
                id: inv1.id,
                amt: inv1.amt,
                paid: inv1.paid,
                add_date: '2023-03-04T06:00:00.000Z',
                paid_date: null,
                company: {
                    code: ibm.code,
                    name: ibm.name,
                    description: ibm.description,
                },
            }
        });
    });

    test('get non-existent invoice', async () => {
        const response = await request(app).get(`/invoices/0`).send();
        expect(response.statusCode).toEqual(404);
    });

    test('create invoice test', async () => {
        const testAmt = 1234;
        const response = await request(app).post('/invoices').send({
            comp_code: ibm.code,
            amt: testAmt,
        });
        expect(response.statusCode).toEqual(201);

        expect(response.body).toEqual({
            invoice: {
                id: 3,
                amt: testAmt,
                paid: false,
                add_date: expect.any(String),
                paid_date: null,
                comp_code: ibm.code,
            }
        });
    });

    test('update invoice test', async () => {
        const testAmt = 1;
        const response = await request(app).put(`/invoices/${inv1.id}`).send({
            id: inv1.id,
            amt: testAmt,
            paid: true,
        });
        expect(response.statusCode).toEqual(200);
        
        expect(response.body).toEqual({
            invoice: {
                id: inv1.id,
                amt: testAmt,
                paid: true,
                add_date: expect.any(String),
                paid_date: expect.any(String),
                comp_code: inv1.comp_code,
            }
        });
    });

    test('update invoice unpaid', async () => {
        const testAmt = 1234;
        const response = await request(app).put(`/invoices/${inv2.id}`).send({
            id: inv2.id,
            amt: testAmt,
            paid: false,
        });
        expect(response.statusCode).toEqual(200);
        
        expect(response.body).toEqual({
            invoice: {
                id: inv2.id,
                amt: testAmt,
                paid: false,
                add_date: expect.any(String),
                paid_date: null,
                comp_code: inv2.comp_code,
            }
        });
    });

    test('update non-existent invoice', async () => {
        const response = await request(app).get(`/invoices/0`).send({
            id: 0,
            amt: -1,
        });
        expect(response.statusCode).toEqual(404);
    });

    test('delete invoice test', async () => {
        const response = await request(app).delete(`/invoices/${inv2.id}`).send();
        expect(response.statusCode).toEqual(200);

        expect(response.body).toEqual({ status: "deleted" });
    });

    test('delete non-existent invoice', async () => {
        const response = await request(app).delete(`/invoices/0`).send();
        expect(response.statusCode).toEqual(404);
    });

});
