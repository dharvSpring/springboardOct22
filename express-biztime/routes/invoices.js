const express = require('express');
const router = new express.Router();
const db = require('../db');

const ExpressError = require('../expressError')

const invoiceTable = 'invoices';
const companyTable = 'companies';

// CREATE TABLE invoices (
//     id serial PRIMARY KEY,
//     comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
//     amt float NOT NULL,
//     paid boolean DEFAULT false NOT NULL,
//     add_date date DEFAULT CURRENT_DATE NOT NULL,
//     paid_date date,
//     CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
// );


/**
 * GET /invoices
 * 
 * Return info on invoices: like {invoices: [{id, comp_code}, ...]}
 */
router.get("/", async function(req, res, next) {
    try {
        const result = await db.query(
            `SELECT id, comp_code
            FROM ${invoiceTable}
            ORDER BY id`
        );
        return res.json({'invoices': result.rows});
    } catch (err) {
        return next(err);
    }
});


/**
 * GET /invoices/[id]
 * Returns obj on given invoice.
 * If invoice cannot be found, returns 404.
 * 
 * Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}
 */
router.get("/:id", async function(req, res, next) {
    try {
        const id = req.params.id;
        const result = await db.query(
            `SELECT i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date, c.name, c.description
            FROM ${invoiceTable} AS i
            JOIN ${companyTable} AS c
            ON i.comp_code = c.code
            WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found: ${id}`, 404);
        }

        const invoice = {
            id: result.rows[0].id,
            amt: result.rows[0].amt,
            paid: result.rows[0].paid,
            add_date: result.rows[0].add_date,
            paid_date: result.rows[0].paid_date,
            company: {
                code: result.rows[0].comp_code,
                name: result.rows[0].name,
                description: result.rows[0].description,
            },
        };

        return res.json({'invoice': invoice});
    } catch (err) {
        return next(err);
    }
});


/**
 * POST /invoices
 * Adds an invoice.
 * Needs to be passed in JSON body of: {comp_code, amt}
 * 
 * Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
 */
router.post("/", async function(req, res, next) {
    try {
        const  {comp_code, amt} = req.body;
        const result = await db.query(
            `INSERT INTO ${invoiceTable}
            (comp_code, amt)
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );

        return res.status(201).json({'invoice': result.rows[0]});
    } catch (err) {
        return next(err);
    }
});


/**
 * PUT /invoices/[id]
 * Updates an invoice.
 * If invoice cannot be found, returns a 404.
 * Needs to be passed in a JSON body of {amt}
 * 
 * Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
 */
router.put("/:id", async function(req, res, next) {
    try {
        const id = req.params.id;
        const  amt = req.body.amt;

        let result = await db.query(
            `SELECT id, amt, paid, add_date, paid_date
            FROM ${invoiceTable}
            WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found: ${id}`, 404);
        }

        
        result = await db.query(
            `UPDATE ${invoiceTable}
            SET amt=$1, paid_date=$2
            WHERE id = $3
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, new Date(), id]
        );

        return res.json({'invoice': result.rows[0]});
    } catch (err) {
        return next(err);
    }
});


/**
 * DELETE /invoices/[id]
 * Deletes an invoice.
 * If invoice cannot be found, returns a 404.
 * 
 * Returns: {status: "deleted"}
 */
router.delete("/:id", async function(req, res, next) {
    try {
        const id = req.params.id;
        const result = await db.query(
            `DELETE FROM ${invoiceTable}
            WHERE id = $1
            RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found: ${id}`, 404);
        }

        return res.json({status: "deleted"});
    } catch (err) {
        return next(err);
    }
});


module.exports = router;