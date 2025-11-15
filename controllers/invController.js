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

module.exports = invController
