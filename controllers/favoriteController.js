const utilities = require("../utilities")
const favoriteModel = require("../models/favorite-model")

async function toggleFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const invId = parseInt(req.params.invId, 10)

  if (!Number.isInteger(invId) || invId <= 0) {
    req.flash("notice", "Invalid vehicle selection.")
    return res.redirect("back")
  }

  const exists = await favoriteModel.isFavorite(account_id, invId)
  const redirectTo = req.body?.redirectTo

  if (exists) {
    await favoriteModel.removeFavorite(account_id, invId)
    req.flash("notice", "Vehicle removed from your saved list.")
  } else {
    await favoriteModel.addFavorite(account_id, invId)
    req.flash("notice", "Vehicle added to your saved vehicles.")
  }

  const referer = req.get("referer") || ""
  const redirectTarget = redirectTo
    ? redirectTo
    : referer.includes("/account/favorites")
      ? "/account/favorites"
      : "/inv/detail/" + invId

  return res.redirect(redirectTarget)
}

async function buildFavoritesView(req, res) {
  const account_id = res.locals.accountData.account_id
  const favorites = await favoriteModel.getFavoritesForAccount(account_id)
  const nav = await utilities.getNav()

  res.render("account/favorites", {
    title: "Saved Vehicles",
    nav,
    errors: null,
    message: req.flash("notice"),
    favorites,
  })
}

module.exports = {
  toggleFavorite,
  buildFavoritesView,
}
