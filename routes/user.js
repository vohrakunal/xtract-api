// imports
const express = require("express");
const passport = require("passport");

// express router
const router = express.Router();


// APIS

const {
  addUser
} = require("../api/adduser");

// middleware
// const validate = require("../middlewares/validate");

router.post(
  "/userlogin",
  async (req, res, next) => {
    passport.authenticate("users", (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;

        const token = passportUser.generateJwt();

        // Sends authorization token in response header if successfully authenticated
        return res.send({ id: user._id, token });
      }

      return res.status(400).send(info);
    })(req, res, next);
  }
);


router.post("/addUser", async (req, res) => {
  
  const recData = req.body;
  let rtnVal = {
    errmsg: "All Fields are required"
  };
  if (
    recData.name &&
    recData.email &&
    recData.password
  ) {
    rtnVal = await addUser(req.body);
  }

  res.send(rtnVal).status(200);
});


module.exports = router;
