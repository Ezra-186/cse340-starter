const utilities = require("../utilities")
const subscriptionModel = require("../models/subscription-model")

async function subscribe(req, res) {
  const referer = req.get("referer") || "/"
  const rawEmail = req.body.newsletter_email
  const email = rawEmail ? rawEmail.toLowerCase() : ""

  if (!email) {
    req.flash("notice", "Please enter your email address.")
    return res.redirect(referer)
  }

  const subscribed = await subscriptionModel.isSubscribed(email)

  if (!subscribed) {
    await subscriptionModel.addSubscription(email)
    req.flash("notice", "Thanks, you have been added to our email list.")
  } else {
    req.flash("notice", "You are already on our email list.")
  }

  return res.redirect(referer)
}

module.exports = { subscribe }
