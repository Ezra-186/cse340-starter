const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a first name.")
        .bail()
        .isLength({ min: 1 }),

    // lastname is required and must be string
    body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a last name.")
        .bail()
        .isLength({ min: 2 }),

    // valid email is required
    body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A valid email is required.")
        .bail()
        .isEmail()
        .normalizeEmail(),

    // password is required and must be strong password
    body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password does not meet requirements.")
        .bail()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      errors,
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

module.exports = validate
