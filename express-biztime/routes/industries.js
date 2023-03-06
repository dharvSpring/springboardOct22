const express = require('express');
const router = new express.Router();
const db = require('../db');
const slugify = require("slugify");
const ExpressError = require('../expressError')

const companyTable = 'companies';
const industriesTable = 'industries'
const industriesCompaniesTable = 'companies_industries'

// CREATE TABLE industries (
//     code text PRIMARY KEY,
//     name text NOT NULL UNIQUE,
//     description text
// );


/**
 * GET /industries
 * 
 * Returns list of industries with company codes, like {industries: [{code, companies: [comp_code, ...]}, ...]}
 */
router.get("/", async function(req, res, next) {
    try {

        const result = await db.query(
            `SELECT i.code, ic.comp_code
            FROM ${industriesTable} AS i
            LEFT JOIN ${industriesCompaniesTable} AS ic
            ON i.code = ic.ind_code
            ORDER BY i.code`
        );

        const indMap = new Map();
        for (ind of result.rows) {
            if (indMap.has(ind.code)) {
                indMap.get(ind.code).push(ind.comp_code);
            } else {
                indMap.set(ind.code, ind.comp_code ? [ind.comp_code] : []);
            }
        }
        const industries = Array.from(indMap.keys()).map(code => ({code, companies: indMap.get(code)}));

        return res.json({'industries': industries});
    } catch (err) {
        return next(err);
    }
});


/**
 * GET /industries/[code]
 * If the industry given cannot be found, this should return a 404 status response.
 * 
 * Return obj of industry: {industry: {ind_code, name, description, companies: [comp_code, ...]}}
 */
router.get("/:code", async function(req, res, next) {
    try {
        const ind_code = req.params.code;
        console.log(ind_code)
        const result = await db.query(
            `SELECT i.code, i.name, i.description, ic.comp_code
            FROM ${industriesTable} AS i
            LEFT JOIN ${industriesCompaniesTable} AS ic
            ON i.code = ic.ind_code
            WHERE code = $1`,
            [ind_code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Industry not found: ${ind_code}`, 404);
        }

        const indInfo = result.rows[0];
        const companies = result.rows.map(c => c.comp_code);

        return res.json({'industry': {
            code: indInfo.code,
            name: indInfo.name,
            description: indInfo.description,
            companies: companies,
        }});
    } catch (err) {
        return next(err);
    }
});


/**
 * POST /industries
 * Adds a industry.
 * Needs to be given JSON like: {code, name, description}
 * Code is optional, if absent will slugify name
 * 
 * Returns obj of new industry: {industry: {code, name, description}}
 */
router.post("/", async function(req, res, next) {
    try {
        const  {code, name, description} = req.body;
        const ind_code = code ? code : slugify(name, {lower: true});
        const result = await db.query(
            `INSERT INTO ${industriesTable}
            (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [ind_code, name, description]
        );

        return res.status(201).json({'industry': result.rows[0]});
    } catch (err) {
        return next(err);
    }
});


/**
 * PUT /industries/[code]
 * Edit existing industry.
 * Should return 404 if industry cannot be found.
 * Needs to be given JSON like: {name, description}
 * 
 * Returns update industry object: {industry: {code, name, description}}
 */
router.put("/:code", async function(req, res, next) {
    try {
        const code = req.params.code;
        const  {name, description} = req.body;
        const result = await db.query(
            `UPDATE ${industriesTable}
            SET name=$1, description=$2
            WHERE code = $3
            RETURNING code, name, description`,
            [name, description, code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Industry not found: ${code}`, 404);
        }

        return res.json({'industry': result.rows[0]});
    } catch (err) {
        return next(err);
    }
});


/**
 * DELETE /industries/[code]
 * Deletes industry.
 * Should return 404 if industry cannot be found.
 * 
 * Returns {status: "deleted"}
 */
router.delete("/:code", async function(req, res, next) {
    try {
        const code = req.params.code;
        const result = await db.query(
            `DELETE FROM ${industriesTable}
            WHERE code = $1
            RETURNING code`,
            [code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Industry not found: ${code}`, 404);
        }

        return res.json({status: "deleted"});
    } catch (err) {
        return next(err);
    }
});


/**
 * POST /industries/[code]/add
 * Adds a company to industry.
 * Needs to be given JSON like: {comp_code}
 * Should return 404 if industry or company cannot be found.
 * 
 * Returns {added: {comp_code, ind_code}}
 */
router.post("/:code/add", async function(req, res, next) {
    try {
        const code = req.params.code;
        const comp_code = req.body.comp_code;
        
        const checkExists = await Promise.all([
            db.query(`SELECT code FROM ${industriesTable} WHERE code=$1`, [code]),
            db.query(`SELECT code FROM ${companyTable} WHERE code=$1`, [comp_code]),
        ]);

        if (checkExists[0].rows.length === 0) {
            throw new ExpressError(`Industry not found: ${code}`, 404);
        }

        if (checkExists[1].rows.length === 0) {
            throw new ExpressError(`Company not found: ${comp_code}`, 404);
        }

        const result = await db.query(
            `INSERT INTO ${industriesCompaniesTable}
            (comp_code, ind_code)
            VALUES ($1, $2)
            RETURNING comp_code, ind_code`,
            [comp_code, code]
        );

        return res.status(201).json({'added': result.rows[0]});
    } catch (err) {
        return next(err);
    }
});


module.exports = router;