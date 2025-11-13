const path = require("path")
const express = require("express")
const session = require("express-session")
const PgSession = require("connect-pg-simple")(session)
const morgan = require("morgan")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const pool = require("./database/pool")
const utilities = require("./utilities")

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

// Sessions
app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
)

// Routes
app.use("/", require("./routes/index"))
app.use("/health", require("./routes/health"))
app.use("/inv", require("./routes/inventory"))

app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
