const config = require("config");
const jwt = require("express-jwt");

const getTokenFromHeaders = req => {
  const {
    headers: { authorization }
  } = req;

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }
  return null;
};

const secret = config.get("jwtsecret");

const auth = jwt({
  secret,
  userProperty: "payload",
  getToken: getTokenFromHeaders
});

module.exports = auth;
