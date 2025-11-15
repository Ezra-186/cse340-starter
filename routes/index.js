const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const baseController = require("../controllers/baseController")

router.get("/", utilities.handleErrors(baseController.buildHome))

router.get(
  "/trigger-error",
  utilities.handleErrors(baseController.triggerError)
)

module.exports = router
