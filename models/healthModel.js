const pool = require("../database/pool");

exports.ping = async () => {
  const { rows } = await pool.query("select 'ok' as db");
  return rows[0].db;
};
