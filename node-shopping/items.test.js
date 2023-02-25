process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('./app');
const itemRouter = require('./items');

describe('item routing tests', () => {

    beforeEach(() => {
        // TODO
    })

    test('get all items', () => {
        // TODO
    });

    test('get single item', () => {
        // TODO
    });

    test('create item test', () => {
        // TODO
    });

    test('update item test', () => {
        // TODO
    });

    test('delete item test', () => {
        // TODO
    });

    // etc
});
