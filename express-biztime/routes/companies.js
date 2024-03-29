const express = require('express');
const router = new express.Router();
const db = require('../db');
const slugify = require("slugify");
const ExpressError = require('../expressError')

const companyTable = 'companies';
const invoiceTable = 'invoices';
const industriesTable = 'industries'
const industriesCompaniesTable = 'companies_industries'

// CREATE TABLE companies (
//     code text PRIMARY KEY,
//     name text NOT NULL UNIQUE,
//     description text
// );


/**
 * GET /companies
 * 
 * Returns list of companies, like {companies: [{code, name}, ...]}
 */
router.get("/", async function(req, res, next) {
    try {
        const result = await db.query(
            `SELECT code, name
            FROM ${companyTable}
            ORDER BY name`
        );
        return res.json({'companies': result.rows});
    } catch (err) {
        return next(err);
    }
});


/**
 * GET /companies/[code]
 * If the company given cannot be found, this should return a 404 status response.
 * 
 * Return obj of company: {company: {code, name, description}}
 * 
 * INVOICES:
 * GET /companies/[code]
 * If the company given cannot be found, this should return a 404 status response.
 * 
 * Return obj of company: {company: {code, name, description, invoices: [id, ...], industries: [ind_name, ...]}}
 */
router.get("/:code", async function(req, res, next) {
    try {
        const code = req.params.code;
        const result = await db.query(
            `SELECT c.code, c.name, c.description, i.name as ind_name
            FROM ${companyTable} as c
            LEFT JOIN ${industriesCompaniesTable} as ic
            ON c.code = ic.comp_code
            LEFT JOIN ${industriesTable} as i
            ON ic.ind_code = i.code
            WHERE c.code = $1`,
            [code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Company not found: ${code}`, 404);
        }

        const invoiceResults = await db.query(
            `SELECT id
            FROM ${invoiceTable}
            WHERE comp_code=$1`,
            [code]
        );

        const companyInfo = result.rows[0];
        const invoices = invoiceResults.rows.map(inv => inv.id);
        const industries = result.rows.map(c => (c.ind_name ? c.ind_name : undefined));

        return res.json({'company': {
            code: companyInfo.code,
            name: companyInfo.name,
            description: companyInfo.description,
            invoices,
            industries: industries[0] ? industries : [],
        }});
    } catch (err) {
        return next(err);
    }
});


/**
 * POST /companies
 * Adds a company.
 * Needs to be given JSON like: {code, name, description}
 * 
 * Returns obj of new company: {company: {code, name, description}}
 */
router.post("/", async function(req, res, next) {
    try {
        const  {name, description} = req.body;
        const code = slugify(name, {lower: true});
        const result = await db.query(
            `INSERT INTO ${companyTable}
            (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]
        );

        return res.status(201).json({'company': result.rows[0]});
    } catch (err) {
        return next(err);
    }
});


/**
 * PUT /companies/[code]
 * Edit existing company.
 * Should return 404 if company cannot be found.
 * Needs to be given JSON like: {name, description}
 * 
 * Returns update company object: {company: {code, name, description}}
 */
router.put("/:code", async function(req, res, next) {
    try {
        const code = req.params.code;
        const  {name, description} = req.body;
        const result = await db.query(
            `UPDATE ${companyTable}
            SET name=$1, description=$2
            WHERE code = $3
            RETURNING code, name, description`,
            [name, description, code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Company not found: ${code}`, 404);
        }

        return res.json({'company': result.rows[0]});
    } catch (err) {
        return next(err);
    }
});


/**
 * DELETE /companies/[code]
 * Deletes company.
 * Should return 404 if company cannot be found.
 * 
 * Returns {status: "deleted"}
 */
router.delete("/:code", async function(req, res, next) {
    try {
        const code = req.params.code;
        const result = await db.query(
            `DELETE FROM ${companyTable}
            WHERE code = $1
            RETURNING code`,
            [code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Company not found: ${code}`, 404);
        }

        return res.json({status: "deleted"});
    } catch (err) {
        return next(err);
    }
});


module.exports = router;