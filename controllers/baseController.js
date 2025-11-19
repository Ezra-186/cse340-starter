const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav()

  // // test
  // req.flash("notice", "This is a flash message.")

  res.render("index", { title: "Home", nav })
}

baseController.triggerError = async function () {
  throw new Error("Intentional 500 error for testing the error handler.")
}

module.exports = baseController
