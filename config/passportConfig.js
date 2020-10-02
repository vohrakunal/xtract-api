const passport = require("passport");
const { userStrategy } = require("./strategy");
passport.use("users", userStrategy);
