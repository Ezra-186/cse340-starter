const { body, validationResult } = require("express-validator")
const utilities = require(".")

const invValidate = {}

invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage(
        "Classification name may not contain spaces or special characters."
      ),
  ]
}

invValidate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      message: null,
      classification_name,
    })
  }
  next()
}

invValidate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please choose a classification."),
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 9999 })
      .withMessage("Year must be four digits."),
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Miles must be zero or greater."),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."),
  ]
}

invValidate.checkInventoryData = async (req, res, next) => {
  const classification_id = req.body.classification_id
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      classification_id
    )
    return res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      message: null,
      errors: errors.array(),
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
  next()
}


module.exports = invValidate
