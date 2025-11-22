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

async function getVehicleById(inv_id) {
  const sql = `
    SELECT inv_id, inv_make, inv_model, inv_year,
           inv_price, inv_color, inv_miles,
           inv_description, inv_image, inv_thumbnail
    FROM public.inventory
    WHERE inv_id = $1
  `
  const result = await pool.query(sql, [inv_id])
  return result.rows[0] || null
}

async function addClassification(classification_name) {
  const sql = `
    INSERT INTO public.classification (classification_name)
    VALUES ($1)
    RETURNING *
  `
  return pool.query(sql, [classification_name])
}

async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  const sql = `
    INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `
  return pool.query(sql, [
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  ])
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
}
