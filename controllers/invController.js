const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

invController.buildByClassificationId = async function (req, res) {
  const classificationId = Number(req.params.classificationId)
  const nav = await utilities.getNav()
  const data = await invModel.getInventoryByClassificationId(classificationId)
  const grid = utilities.buildClassificationGrid(data.rows)
  res.render("inventory/classification", { title: "Vehicles", nav, grid })
}

invController.buildVehicleDetail = async function (req, res) {
  const invId = Number(req.params.invId)
  const nav = await utilities.getNav()
  const vehicleData = await invModel.getVehicleById(invId)
  const vehicleDetail = utilities.buildVehicleDetailHtml(vehicleData)
  const title = vehicleData
    ? `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`
    : "Vehicle Not Found"
  res.render("inventory/detail", { title, nav, vehicleDetail })
}

invController.buildManagementView = async function (req, res) {
  const nav = await utilities.getNav()
  const message = req.flash("notice")
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    message,
  })
}

invController.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  const message = req.flash("notice")
  const { classification_name = "" } = req.body || {}
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    message,
    classification_name,
  })
}

invController.registerClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)
  if (result) {
    const nav = await utilities.getNav()
    req.flash("notice", "Classification added.")
    const message = req.flash("notice")
    return res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      message,
    })
  } else {
    const nav = await utilities.getNav()
    req.flash("notice", "Sorry, the classification could not be added.")
    const message = req.flash("notice")
    return res.status(500).render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    message,
    classification_name,
  })
  }
}

invController.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classification_id = req.body?.classification_id
    ? Number(req.body.classification_id)
    : null
  const classificationList = await utilities.buildClassificationList(
    classification_id
  )
  const message = req.flash("notice")
  const {
    inv_make = "",
    inv_model = "",
    inv_year = "",
    inv_description = "",
    inv_image = "",
    inv_thumbnail = "",
    inv_price = "",
    inv_miles = "",
    inv_color = "",
  } = req.body || {}
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    message,
    errors: null,
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
  })
}

invController.registerInventory = async function (req, res) {
  const {
    inv_make = "",
    inv_model = "",
    inv_year = "",
    inv_description = "",
    inv_image = "",
    inv_thumbnail = "",
    inv_price = "",
    inv_miles = "",
    inv_color = "",
    classification_id,
  } = req.body
  const numericPrice = Number(inv_price)
  const numericYear = Number(inv_year)
  const numericMiles = Number(inv_miles)
  const numericClassificationId = Number(classification_id)
  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    numericYear,
    inv_description,
    inv_image,
    inv_thumbnail,
    numericPrice,
    numericMiles,
    inv_color,
    numericClassificationId
  )
  if (result) {
    req.flash("notice", "The vehicle has been added.")
    const nav = await utilities.getNav()
    const message = req.flash("notice")
    return res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      message,
    })
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.")
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      numericClassificationId
    )
    const message = req.flash("notice")
    return res.status(500).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      message,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id: numericClassificationId,
    })
  }
}

module.exports = invController
