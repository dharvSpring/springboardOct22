/** Database setup for BizTime. */
// process.env.PGPASSWORD is set in ~/.profile

const {Client} = require('pg');

let DB_URI;
if (process.env.NODE_ENV == 'test') {
    DB_URI = "postgresql:///biztime_test";
} else {
    DB_URI = "postgresql:///biztime";
}

console.log(DB_URI);
const client = new Client({
    connectionString: DB_URI,
});

async function connect() {
    await client.connect();
}
connect();

module.exports = client;
