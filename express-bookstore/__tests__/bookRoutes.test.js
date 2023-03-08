process.env.NODE_ENV = 'test'

const request = require('supertest');

const app = require('../app');
const db = require('../db');
const Book = require('../models/book');

const sampleBook = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
};

afterAll(async function () {
    await db.end();
});

async function createSampleBook() {
    await db.query("DELETE FROM books");
    await Book.create(sampleBook);
}

describe("Book Routes Get Test", function () {

    beforeEach(createSampleBook);

    /** Get data */

    test("/books get book list", async function () {
        const result = await request(app).get("/books/");
        expect(result.status).toEqual(200);
        
        const books = result.body.books;
        expect(books.length).toEqual(1);
        expect(books[0].isbn).toEqual(sampleBook.isbn);
    });

    test("/books/:isbn get single book", async function () {
        const result = await request(app).get(`/books/${sampleBook.isbn}`);
        expect(result.status).toEqual(200);
        
        const book = result.body.book;
        expect(book).toEqual(sampleBook);
    });

    test("/books/:isbn get non-existent book", async function () {
        const result = await request(app).get(`/books/0000000000`);
        expect(result.status).toEqual(404);
    });
    
})

describe("Book Routes Create Test", function () {

    beforeEach(async function () {
        await db.query("DELETE FROM books");
    });

    const createSample = {
        "isbn": "1234567890",
        "author": "John Doe",
        "amazon_url": "http://a.co/1337",
        "language": "english",
        "pages": 512,
        "publisher": "Foo Bar Press",
        "title": "This title doesn't exist!",
        "year": 2020
    };

    /** Create book */

    test("/books/ create book", async function () {
        const result = await request(app).post(`/books/`).send(createSample);
        expect(result.status).toEqual(201);

        expect(result.body.book).toEqual(createSample);
    });

    test("/books/ create book isbn too short", async function () {
        const result = await request(app).post(`/books/`).send({
            "isbn": "0",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
        expect(result.status).toEqual(400);

        expect(result.body.message).toEqual(['instance.isbn does not meet minimum length of 10']);
    });

    test("/books/ create book missing fields", async function () {
        const result = await request(app).post(`/books/`).send({
            "isbn": "1234567890",
            "author": "John Doe",
            "language": "english",
            "pages": 512,
            "publisher": "Foo Bar Press",
            "title": "This title doesn't exist!",
        });
        expect(result.status).toEqual(400);

        expect(result.body.message).toEqual([
            'instance requires property "amazon_url"',
            'instance requires property "year"',
        ]);
    });
})

describe("Book Routes Update Test", function () {

    beforeEach(createSampleBook);

    /** Update book */

    test("/books/:isbn update book", async function () {
        const result = await request(app).put(`/books/${sampleBook.isbn}`).send({
            "amazon_url": sampleBook.amazon_url,
            "author": "John Doe",
            "language": sampleBook.language,
            "pages": sampleBook.pages,
            "publisher": sampleBook.publisher,
            "title": "Power-up john doe edition!",
            "year": sampleBook.year
        });
        expect(result.status).toEqual(200);

        expect(result.body.book).toEqual({
            isbn: sampleBook.isbn,
            amazon_url: sampleBook.amazon_url,
            author: "John Doe",
            language: sampleBook.language,
            pages: sampleBook.pages,
            publisher: sampleBook.publisher,
            title: "Power-up john doe edition!",
            year: sampleBook.year,
        });
    });

    test("/books/:isbn missing fields", async function () {
        const result = await request(app).put(`/books/${sampleBook.isbn}`).send({
            "author": "John Doe",
            "language": "english",
            "pages": 512,
            "publisher": "Foo Bar Press",
            "title": "This title doesn't exist!",
        });
        expect(result.status).toEqual(400);

        expect(result.body.message).toEqual([
            'instance requires property "amazon_url"',
            'instance requires property "year"',
        ]);
    });

    test("/books/:isbn update non-existent book", async function () {
        const result = await request(app).put(`/books/0000000000`).send(sampleBook);
        expect(result.status).toEqual(404);
    });
})

describe("Book Routes Delete Test", function () {

    beforeEach(createSampleBook);

    /** Delete book */

    test("/books/:isbn delete book", async function () {
        const result = await request(app).delete(`/books/${sampleBook.isbn}`);
        expect(result.status).toEqual(200);

        expect(result.body).toEqual({message: "Book deleted"});
    });

    test("/books/:isbn delete non-existent book", async function () {
        const result = await request(app).delete(`/books/0000000000`);
        expect(result.status).toEqual(404);
    });
})