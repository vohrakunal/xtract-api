const bodyParser = require("body-parser");
const index = require("../routes");
const error = require("../middlewares/error");

module.exports = app => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "50mb" }));

  app.use("/api/v1", index);

  app.use(error);
};
