const invModel = require("../models/inventory-model")

const Util = {}

Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = function (rows) {
  if (!rows || rows.length === 0) {
    return "<p>No vehicles found.</p>"
  }

  let grid = '<ul class="inv-grid">'
  rows.forEach((v) => {
    grid += `
      <li class="inv-card">
        <a href="/inv/detail/${v.inv_id}" title="${v.inv_year} ${v.inv_make} ${v.inv_model}">
          ${v.inv_thumbnail && v.inv_thumbnail.trim() !== ""
            ? `<img src="${v.inv_thumbnail}" alt="${v.inv_make} ${v.inv_model}" />`
            : ""
          }
          <h3>${v.inv_year} ${v.inv_make} ${v.inv_model}</h3>
          <p>$${Number(v.inv_price).toLocaleString()}</p>
        </a>
      </li>`
  })
  grid += "</ul>"

  return grid
}

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
