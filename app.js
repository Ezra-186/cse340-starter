const path = require("path");
const express = require("express");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const pool = require("./database/pool");

const app = express();
const PORT = parseInt(process.env.PORT || "5500", 10);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  }),
);

app.use("/", require("./routes/index"));
app.use("/health", require("./routes/health"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error. Check the logs.");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
