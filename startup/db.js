const config = require("config");
const mongoose = require("mongoose");

const db = config.get("db");
const conf = config.get("conf");

// mongoose.set({ 'debug': true })
module.exports = () => {
  mongoose.connect(db, conf).then(() => {
    console.log(`Connected to ${db}...`);
    // mongoose.set('debug', true);
  });
};
