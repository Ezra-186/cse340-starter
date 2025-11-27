// Inventory controller
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

// List vehicles by classification
invController.buildByClassificationId = async function (req, res) {
  const classificationId = Number(req.params.classificationId)
  const nav = await utilities.getNav()
  const data = await invModel.getInventoryByClassificationId(classificationId)
  const grid = utilities.buildClassificationGrid(data.rows)
  res.render("inventory/classification", { title: "Vehicles", nav, grid })
}

// Vehicle detail view
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

// Inventory management view
invController.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const message = req.flash("notice")

    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
      message,
    })
  } catch (error) {
    next(error)
  }
}


// Add classification form
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

// Save new classification
invController.registerClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    req.flash("notice", "Classification added.")
    const message = req.flash("notice")

    return res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
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

// Add inventory form
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

// Save new vehicle
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
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    req.flash("notice", "The vehicle has been added.")
    const message = req.flash("notice")

    return res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
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

// JSON list of inventory for a classification
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id, 10)
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  )
  const rows = invData.rows || []

  if (rows.length > 0) {
    return res.json(rows)
  } else {
    next(new Error("No data returned"))
  }
}

// Edit inventory view
invController.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  )
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

// Update inventory record
invController.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList =
      await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
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
}

// Build delete confirmation view
invController.buildDeleteConfirm = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    message: req.flash("notice"),
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

// Delete Inventory Item
invController.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult && deleteResult.rowCount > 0) {
    req.flash("notice", "The vehicle was successfully deleted.")
    return res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    return res.redirect("/inv/delete/" + inv_id)
  }
}


module.exports = invController
