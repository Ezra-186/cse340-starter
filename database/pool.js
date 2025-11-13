const { Pool } = require("pg")

const needsSSL =
  process.env.DATABASE_URL &&
  /render\.com/i.test(process.env.DATABASE_URL)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
})

module.exports = pool
