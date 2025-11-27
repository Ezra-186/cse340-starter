const path = require("path")
const express = require("express")
const session = require("express-session")
const PgSession = require("connect-pg-simple")(session)
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const pool = require("./database/pool")
const utilities = require("./utilities")
const accountRoute = require("./routes/accountRoute")
const cookieParser = require("cookie-parser")

const app = express()
const PORT = parseInt(process.env.PORT || "5500", 10)

// Views
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout")

// Static and parsers
app.use(express.static(path.join(__dirname, "public")))
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Sessions
app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

// Flash messages
app.use(require("connect-flash")())

app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

// JWT check
app.use(utilities.checkJWTToken)

// Routes
app.use("/", require("./routes/index"))
app.use("/health", require("./routes/health"))
app.use("/inv", require("./routes/inventoryRoute"))
app.use("/account", accountRoute)

// 404 handler
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

// Error handler
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const status = err.status || 500
  const nav = await utilities.getNav()
  const message =
    err.message || "Oh no! There was a crash. Maybe try a different route?"

  res.status(status).render("errors/error", {
    title: `${status} Error`,
    message,
    nav,
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
