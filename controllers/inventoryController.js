const utilities = require("../utilities")
const invModel = require("../models/inventory-model")

async function buildByClassification(req, res, next) {
  try {
    const id = Number(req.params.classificationId)
    const nav = await utilities.getNav()
    const data = await invModel.getInventoryByClassificationId(id)
    const grid = utilities.buildClassificationGrid(data.rows)
    res.render("inventory/classification", { title: "Vehicles", nav, grid })
  } catch (err) { next(err) }
}

async function buildDetail(req, res, next) {
  try {
    const invId = Number(req.params.invId)
    const nav = await utilities.getNav()
    const vehicle = await invModel.getVehicleById(invId)
    if (!vehicle) return res.status(404).render("errors/404", { title: "Not Found", nav })

    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
    res.render("inventory/detail", { title, nav, vehicle })
  } catch (err) { next(err) }
}

module.exports = { buildByClassification, buildDetail }
