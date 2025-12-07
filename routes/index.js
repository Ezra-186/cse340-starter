const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const baseController = require("../controllers/baseController")
const subscriptionController = require("../controllers/subscriptionController")
const subscriptionValidate = require("../utilities/subscription-validation")

router.get("/", utilities.handleErrors(baseController.buildHome))

router.get(
  "/trigger-error",
  utilities.handleErrors(baseController.triggerError)
)

router.post(
  "/subscribe",
  subscriptionValidate.subscriptionRules(),
  subscriptionValidate.checkSubscriptionData,
  utilities.handleErrors(subscriptionController.subscribe)
)

module.exports = router
