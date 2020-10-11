const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: '7GMDafL4V5UXD1cOiVrW',
    host: 'localhost',
    port: 5432,
    database: 'pern_database'
});

module.exports = pool;