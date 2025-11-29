const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/* Registration Data Validation Rules */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name.")
      .bail()
      .isLength({ min: 1 }),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name.")
      .bail()
      .isLength({ min: 2 }),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid email is required.")
      .bail()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email")
        }
        return true
      }),

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

/* Check registration data */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      errors: errors.array(),
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

/* Login Data Validation Rules */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password does not meet requirements."),
  ]
}

/* Check login data */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      errors: errors.array(),
      title: "Login",
      nav,
      account_email,
    })
  }

  next()
}

/* Account update validation rules */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email, { req }) => {
        const account_id = parseInt(req.body.account_id, 10)
        const existingAccount = await accountModel.getAccountByEmail(
          account_email
        )

        if (existingAccount && existingAccount.account_id !== account_id) {
          throw new Error("Email exists. Please use a different email.")
        }
        return true
      }),
  ]
}

/* Check account update data */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    } = req.body

    return res.status(400).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      message: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  }

  next()
}

/* Password change validation rules */
validate.updatePasswordRules = () => {
  return [
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

/* Check password change data */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const account_id = parseInt(req.body.account_id, 10)
    const accountData = await accountModel.getAccountById(account_id)

    return res.status(400).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      message: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,
    })
  }

  next()
}

module.exports = validate
