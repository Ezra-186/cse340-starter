const utilities = require("../utilities")

const baseController = {}

baseController.buildHome = async function (req, res, next) {
  const nav = await utilities.getNav()
  const message = req.flash("notice")

  return res.render("index", {
    title: "Home",
    nav,
    errors: null,
    message,
  })
}

baseController.triggerError = async function () {
  throw new Error("Intentional 500 error for testing the error handler.")
}

module.exports = baseController
