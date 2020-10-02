// imports
const express = require("express");

// express router
const router = express.Router();

// middlewares
// const auth = require('../middlewares/auth');
// const adminonly = require('../middlewares/admin');

// normal routes
// router.use('/admin', require('./admin'));

router.use("/user", require("./user"));


// router.use("/fileupload", require("./fileupload"));


module.exports = router;
