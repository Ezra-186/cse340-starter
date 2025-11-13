const pool = require("../database/pool")

async function getClassifications() {
  return pool.query(
    "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"
  )
}

async function getInventoryByClassificationId(classificationId) {
  const sql = `
    SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_thumbnail
    FROM public.inventory
    WHERE classification_id = $1
    ORDER BY inv_make, inv_model, inv_year
  `
  return pool.query(sql, [classificationId])
}

async function getVehicleById(invId) {
  const sql = `
    SELECT inv_id, inv_make, inv_model, inv_year,
           inv_price, inv_color, inv_miles,
           inv_description, inv_image, inv_thumbnail
    FROM public.inventory
    WHERE inv_id = $1
  `
  const result = await pool.query(sql, [invId])
  return result.rows[0] || null
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
}
