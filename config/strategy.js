const CustomStrategy = require("passport-custom");
const { Users } = require("../models/users");

const strategy = model => async (req, done) => {
  const {
    body: { email, password }
  } = req;

  const user = await model.findOne({
    $or: [{ userEmail: email }]
  });

  if (!user) {
    return done(null, false, {
      message: "Invalid username or password"
    });
  }

  const correctPassword = await user.validatePassword(password);

  if (!correctPassword) {
    return done(null, false, {
      message: "Invalid username or password"
    });
  }

  return done(null, user);
};

module.exports = {
  userStrategy: new CustomStrategy(strategy(Users)),
};
