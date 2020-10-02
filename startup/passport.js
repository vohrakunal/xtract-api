const passport = require("passport");
require("../config/passportConfig");

module.exports = app => {
  app.use(passport.initialize({ userProperty: "currentUser" }));
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((user, done) => {
    done(null, { id: "asssasasasassa" });
  });
};
