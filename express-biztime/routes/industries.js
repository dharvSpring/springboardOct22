const express = require('express');
const router = new express.Router();
const db = require('../db');
const slugify = require("slugify");
const ExpressError = require('../expressError')

const companyTable = 'companies';
const industriesTable = 'industries'
const industriesCompaniesTable = 'industries_companies'

// CREATE TABLE companies (
//     code text PRIMARY KEY,
//     name text NOT NULL UNIQUE,
//     description text
// );


/**
 * GET /industries
 * 
 * Returns list of industries with company codes, like {industries: [{ind_code, companies: [comp_code, ...]}, ...]}
 */
router.get("/", async function(req, res, next) {
    try {
        const result = await db.query(
            `SELECT i.code, c.code
            FROM ${industriesTable} AS i
            LEFT JOIN ${industriesCompaniesTable} AS ic
            ON i.code = ic.ind_code
            JOIN ${companyTable} as c
            ON c.code = ic.comp_code
            ORDER BY i.code`
        );

        // TODO transform the data

        return res.json({'companies': result.rows});
    } catch (err) {
        return next(err);
    }
});


/**
 * GET /industries/[code]
 * If the company given cannot be found, this should return a 404 status response.
 * 
 * Return obj of industry: {industry: {ind_code, name, description, companies: [comp_code, ...]}}
 */
router.get("/:code", async function(req, res, next) {
    try {
        const ind_code = req.params.code;
        const result = await db.query(
            `SELECT code, name, description
            FROM ${industriesTable}
            WHERE code = $1`,
            [ind_code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Industry not found: ${ind_code}`, 404);
        }

        const companies = await db.query(
            `SELECT code
            FROM ${companyTable}
            WHERE ind_code=$1`,
            [ind_code]
        );

        const industryInfo = result.rows[0];
        industryInfo.companies = companies.rows.map(c => c.code);

        return res.json({'industry': industryInfo});
    } catch (err) {
        return next(err);
    }
});


/**
 * POST /industries
 * Adds a industry.
 * Needs to be given JSON like: {ind_code, name, description}
 * 
 * Returns obj of new company: {industry: {ind_code, name, description}}
 */
router.post("/", async function(req, res, next) {
    try {
        const  {ind_code, name, description} = req.body;
        // const code = slugify(name, {lower: true});
        const result = await db.query(
            `INSERT INTO ${industriesTable}
            (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [ind_code, name, description]
        );

        return res.status(201).json({'company': result.rows[0]});
    } catch (err) {
        return next(err);
    }
});


/**
 * PUT /industries/[code]
 * Edit existing company.
 * Should return 404 if company cannot be found.
 * Needs to be given JSON like: {name, description}
 * 
 * Returns update company object: {industry: {ind_code, name, description}}
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
 * DELETE /industries/[code]
 * Deletes industry.
 * Should return 404 if company cannot be found.
 * 
 * Returns {status: "deleted"}
 */
// router.delete("/:code", async function(req, res, next) {
//     try {
//         const code = req.params.code;
//         const result = await db.query(
//             `DELETE FROM ${industriesTable}
//             WHERE code = $1
//             RETURNING code`,
//             [code]
//         );

//         if (result.rows.length === 0) {
//             throw new ExpressError(`Industry not found: ${code}`, 404);
//         }

//         return res.json({status: "deleted"});
//     } catch (err) {
//         return next(err);
//     }
// });


module.exports = router;