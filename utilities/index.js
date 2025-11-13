const invModel = require("../models/inventory-model")

async function getNav() {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  for (const row of data.rows) {
    list += `<li><a href="/inv/type/${row.classification_id}" title="See ${row.classification_name}">${row.classification_name}</a></li>`
  }
  list += "</ul>"
  return list
}

function buildClassificationGrid(rows) {
  if (!rows || rows.length === 0) return "<p>No vehicles found.</p>"
  let grid = '<ul class="inv-grid">'
  for (const v of rows) {
    grid += `<li class="inv-card"><a href="/inv/detail/${v.inv_id}" title="${v.inv_year} ${v.inv_make} ${v.inv_model}">`
    if (v.inv_thumbnail && v.inv_thumbnail.trim() !== "") {
      grid += `<img src="${v.inv_thumbnail}" alt="${v.inv_make} ${v.inv_model}" />`
    }
    grid += `<h3>${v.inv_year} ${v.inv_make} ${v.inv_model}</h3>
             <p>$${Number(v.inv_price).toLocaleString()}</p>
           </a></li>`
  }
  grid += "</ul>"
  return grid
}

module.exports = { getNav, buildClassificationGrid }
