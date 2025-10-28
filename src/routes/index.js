const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query("select 'Hello DB' as msg");
    res.render('index', { title: 'CSE 340 Starter', dbMsg: result.rows[0].msg });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
