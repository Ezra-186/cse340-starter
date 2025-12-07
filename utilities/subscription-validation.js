const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

validate.subscriptionRules = () => {
  return [
    body("newsletter_email")
      .trim()
      .notEmpty()
      .withMessage("Please enter your email address.")
      .bail()
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .normalizeEmail(),
  ]
}

validate.checkSubscriptionData = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg
    const referer = req.get("referer") || "/"
    req.flash("notice", message)
    return res.redirect(referer)
  }

  return next()
}

module.exports = validate
