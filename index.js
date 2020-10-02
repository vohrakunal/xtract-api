// imports
const express = require("express");
const config = require("config");
const app = express();
const morgan = require("morgan");
const server = require("http").createServer(app);

app.use(morgan("dev"));
// env variables
const isProduction = process.env.NODE_ENV === "production";

// handler express async errors
require("express-async-errors");

// is production
if (isProduction) require("./startup/prod")(app);

// startup
require("./startup/db")();
require("./startup/cors")(app);
require("./startup/passport")(app);

require("./startup/routes")(app);

// port
const port = process.env.PORT || config.get("port");

// start server
module.exports = server.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);
