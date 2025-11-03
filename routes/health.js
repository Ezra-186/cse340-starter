const router = require('express').Router();
const pool = require('../database/pool');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query("select 'ok' as db");
    res.status(200).json({ status: 'up', db: rows[0].db });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

