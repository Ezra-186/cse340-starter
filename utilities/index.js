const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

// Navigation
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = '<ul id="primary-nav">'
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

// Classification grid
Util.buildClassificationGrid = function (rows) {
  if (!rows || rows.length === 0) {
    return "<p>No vehicles found.</p>"
  }

  let grid = '<ul class="inv-grid">'
  rows.forEach((v) => {
    grid += `
      <li class="inv-card">
        <a href="/inv/detail/${v.inv_id}" title="${v.inv_year} ${v.inv_make} ${v.inv_model}">
          ${
            v.inv_thumbnail && v.inv_thumbnail.trim() !== ""
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

// Error handler wrapper
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// Vehicle detail html
Util.buildVehicleDetailHtml = function (vehicle) {
  if (!vehicle) {
    return "<p>Sorry, the vehicle could not be found.</p>"
  }

  const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const milesFormatter = new Intl.NumberFormat("en-US")
  const formattedPrice = priceFormatter.format(Number(vehicle.inv_price) || 0)
  const formattedMiles =
    vehicle.inv_miles === null || vehicle.inv_miles === undefined
      ? "N/A"
      : milesFormatter.format(Number(vehicle.inv_miles))
  const color = vehicle.inv_color || "N/A"
  const description = vehicle.inv_description || ""
  const imageSrc = vehicle.inv_image || vehicle.inv_thumbnail || ""

  return `
    <section class="vehicle-detail">
      <figure class="vehicle-detail__image">
        <img src="${imageSrc}" alt="${title}" loading="lazy" decoding="async" />
      </figure>
      <div class="vehicle-detail__info">
        <h2>${title}</h2>
        <p class="vehicle-detail__price">Price: ${formattedPrice}</p>
        <p class="vehicle-detail__miles">Mileage: ${formattedMiles}</p>
        <p class="vehicle-detail__color">Color: ${color}</p>
        <p class="vehicle-detail__description">${description}</p>
      </div>
    </section>
  `
}

// Classification dropdown
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += '<option value="">Choose a Classification</option>'
  data.rows.forEach((row) => {
    const selected =
      classification_id !== null &&
      Number(classification_id) === row.classification_id
        ? " selected"
        : ""
    classificationList += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

/* Middleware to check token validity */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    res.locals.loggedin = 0
    res.locals.accountData = null
    return next()
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      res.locals.loggedin = 0
      res.locals.accountData = null
      return next()
    }

    res.locals.accountData = accountData
    res.locals.loggedin = 1
    return next()
  })
}

/* Require login for protected routes */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next()
  }

  req.flash("notice", "Please log in.")
  return res.redirect("/account/login")
}

/* Check employee or admin */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  const accountData = res.locals.accountData

  if (
    accountData &&
    (accountData.account_type === "Employee" ||
      accountData.account_type === "Admin")
  ) {
    return next()
  }

  req.flash("notice", "You do not have permission to access that page.")
  return res.redirect("/account/login")
}

module.exports = Util
