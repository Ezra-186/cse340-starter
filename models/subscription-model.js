const pool = require("../database/pool")

async function addSubscription(email) {
  try {
    const sql =
      "INSERT INTO public.subscription (email) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [email])
    return data.rows[0]
  } catch (error) {
    if (error.code === "23505") {
      return null
    }
    throw error
  }
}

async function isSubscribed(email) {
  const sql = "SELECT 1 FROM public.subscription WHERE email = $1 LIMIT 1"
  const data = await pool.query(sql, [email])
  return data.rowCount > 0
}

async function ensureSubscribed(email) {
  const subscribed = await isSubscribed(email)
  if (subscribed) {
    return null
  }
  return addSubscription(email)
}

module.exports = { addSubscription, isSubscribed, ensureSubscribed }
