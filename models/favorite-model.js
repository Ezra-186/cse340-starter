const pool = require("../database/pool")

async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO public.account_favorite (account_id, inv_id)
    VALUES ($1, $2)
    RETURNING *
  `

  try {
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0] || null
  } catch (error) {
    if (error.code === "23505") {
      return null
    }

    throw error
  }
}

async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM public.account_favorite
    WHERE account_id = $1 AND inv_id = $2
  `

  const result = await pool.query(sql, [account_id, inv_id])
  return result.rowCount > 0
}

async function getFavoritesForAccount(account_id) {
  const sql = `
    SELECT
      f.inv_id,
      i.inv_make,
      i.inv_model,
      i.inv_price,
      i.inv_thumbnail
    FROM public.account_favorite f
    JOIN public.inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC, i.inv_make, i.inv_model
  `

  const result = await pool.query(sql, [account_id])
  return result.rows || []
}

async function isFavorite(account_id, inv_id) {
  const sql = `
    SELECT 1
    FROM public.account_favorite
    WHERE account_id = $1 AND inv_id = $2
    LIMIT 1
  `

  const result = await pool.query(sql, [account_id, inv_id])
  return result.rowCount > 0
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesForAccount,
  isFavorite,
}
