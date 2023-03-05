const db = require('./db');

const companyTable = 'companies';
const invoiceTable = 'invoices';

async function emptyData() {
    await db.query("DELETE FROM invoices");
    await db.query("DELETE FROM companies");
    await db.query("SELECT setval('invoices_id_seq', 1, false)");
}

async function createCompany(code, name, description) {
    const result = await db.query(
        `INSERT INTO ${companyTable}
        (code, name, description)
        VALUES ($1, $2, $3)
        RETURNING code, name, description`,
        [code, name, description]
    );
    return result.rows[0];
}

async function createInvoice(comp_code, amt, paid, add_date, paid_date) {
    const result = await db.query(
        `INSERT INTO ${invoiceTable}
        (comp_code, amt, paid, add_date, paid_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [comp_code, amt, paid, add_date, paid_date]
    );
    return result.rows[0];
}

async function getCompany(code) {
    const result = await db.query(
        `SELECT code, name, description
        FROM ${companyTable}
        WHERE code = $1`,
        [code]
    );
    return result.rows[0];
}

async function getInvoice(id) {
    const result = await db.query(
        `SELECT id, comp_code, amt, paid, add_date, paid_date
        FROM ${invoiceTable}
        WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}


async function createData() {
    await emptyData();

    await createCompany('ibm', 'IBM', 'Big Blue');
    await createCompany('google', 'Google', 'Internet Search');

    await createInvoice('ibm', 1000, false, '2023-03-04', null);
    await createInvoice('ibm', 1337, true, '2023-01-01', '2023-03-04');
}

module.exports = {createData, getCompany, getInvoice, emptyData};
