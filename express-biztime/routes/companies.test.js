process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const {createData, getCompany} = require('../testUtils');

afterAll(async () => {
    await db.end();
});

describe('companies routing tests', () => {

    let ibm, google;
    beforeEach(async () => {
        await createData();
        [ibm, google] = await Promise.all([getCompany('ibm'), getCompany('google')]);
    });

    test('get all companies', async () => {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toEqual(200);

        const companies = response.body.companies;
        expect(companies.length).toEqual(2);
        
        for (const company of [{code: ibm.code, name: ibm.name}, {code: google.code, name: google.name}]) {
            expect(companies).toContainEqual(company);
        }
    });

    test('get single company', async () => {
        const response = await request(app).get(`/companies/${ibm.code}`).send();
        expect(response.statusCode).toEqual(200);

        expect(response.body).toEqual({
            company: {
                code: ibm.code,
                name: ibm.name,
                description: ibm.description,
                invoices: [1, 2],
                industries: [],
            }
        });
    });

    test('get non-existent company', async () => {
        const response = await request(app).get(`/companies/xyz`).send();
        expect(response.statusCode).toEqual(404);
    });

    test('create company test', async () => {
        const newCode = 'apple-inc'; // slugify!
        const newName = 'Apple Inc';
        const newDesc = 'Macs and iPhones';
        const response = await request(app).post('/companies').send({
            code: newCode,
            name: newName,
            description: newDesc,
        });
        expect(response.statusCode).toEqual(201);

        expect(response.body).toEqual({
            company: { 
                code: newCode,
                name: newName,
                description: newDesc,
            }});
    });

    test('update company test', async () => {
        const newName = 'Bigger IBM';
        const newDesc = 'Bigger and More Bluer';
        const response = await request(app).put(`/companies/${ibm.code}`).send({
            code: ibm.code,
            name: newName,
            description: newDesc,
        });
        expect(response.statusCode).toEqual(200);
        
        expect(response.body).toEqual({
            company: { 
                code: ibm.code,
                name: newName,
                description: newDesc,
            }});
    });

    test('update non-existent company', async () => {
        const response = await request(app).put(`/companies/xyz`).send({
            code: 'xyx',
            name: 'fake',
            description: 'nothing',
        });
        expect(response.statusCode).toEqual(404);
    });

    test('delete company test', async () => {
        const response = await request(app).delete('/companies/google').send();
        expect(response.statusCode).toEqual(200);

        expect(response.body).toEqual({ status: "deleted" });
    });

    test('delete non-existent company', async () => {
        const response = await request(app).delete(`/companies/xyz`).send();
        expect(response.statusCode).toEqual(404);
    });

});
