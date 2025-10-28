// Why: one shared PG pool for all queries
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
module.exports = pool;
