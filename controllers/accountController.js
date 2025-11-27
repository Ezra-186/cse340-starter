const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* Build account management view */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  const { account_firstname } = res.locals.accountData || {}

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    notice: null,
    account_firstname,
  })
}

// Deliver login view
async function buildLogin(req, res, next) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

// Deliver registration view
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav()

  res.render("account/register", {
    title: "Register",
    nav,
    errors: null, 
  })
}

// Process Registration
async function registerAccount(req, res) {
  const nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  // Hash the password before saving it
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    )
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword 
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )

    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")

    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
}

/* Process login request */
async function accountLogin(req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  // If no account with that email
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const passwordsMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!passwordsMatch) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    // Remove hashed password from data before building the token
    delete accountData.account_password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 } // seconds, about 1 hour
    )

    // Set the jwt cookie, httpOnly and secure in production
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000,
      })
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      })
    }

    return res.redirect("/account/")
  } catch (error) {
    throw new Error("Access Forbidden")
  }
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, }
