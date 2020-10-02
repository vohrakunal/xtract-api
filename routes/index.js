// imports
const express = require("express");

// express router
const router = express.Router();

// middlewares
const auth = require('../middlewares/auth');


router.use("/user", require("./user"));


router.use("/fileupload",[auth], require("./fileupload"));


module.exports = router;
