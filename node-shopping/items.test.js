process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('./app');
const Item = require('./item');
const items = require("./fakeDb");

describe('item routing tests', () => {

    let pickles, kimchi, kefir;
    beforeEach(() => {
        // these are automatically added to items
        pickles = new Item('pickles', 3.99);
        kimchi = new Item('kimchi', 4.99);
        kefir = new Item('kefir', 3.49);
    });

    afterEach(() => {
        // empty the list via mutation
        items.length = 0;
    });

    test('get all items', async () => {
        const response = await request(app).get('/items').send();
        expect(response.statusCode).toEqual(200);
        const itemList = response.body;
        expect(itemList.length).toEqual(3);
        for (prod of [pickles, kimchi, kefir]) {
            expect(itemList).toContainEqual(prod);
        }
    });

    test('get single item', async () => {
        const response = await request(app).get(`/items/${pickles.name}`).send();
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(pickles);
    });

    test('create item test', async () => {
        const newName = 'sauerkraut';
        const newPrice = 3.89;
        const response = await request(app).post('/items').send({
            name: newName,
            price: newPrice,
        });
        expect(response.statusCode).toEqual(201);
        expect(response.body).toEqual({added: { name: newName, price: newPrice }});
    });

    test('update item test', async () => {
        const newName = 'spicy kimchi';
        const newPrice = 4.49;
        const response = await request(app).patch('/items/kimchi').send({
            name: newName,
            price: newPrice,
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({ name: newName, price: newPrice });
    });

    test('delete item test', async () => {
        const response = await request(app).delete('/items/kefir').send();
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({ message: "Deleted" });
    });

});
