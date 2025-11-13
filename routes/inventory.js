const router = require("express").Router()
const invController = require("../controllers/inventoryController")

router.get("/type/:classificationId", invController.buildByClassification)

router.get("/detail/:invId", invController.buildDetail)

module.exports = router
