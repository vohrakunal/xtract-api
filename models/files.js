const mongoose = require("mongoose");

const { model, Schema } = require("mongoose");

const config = require("config");

const { ObjectId } = Schema.Types;

const SALT_WORK_FACTOR = 10;


const fileSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: () => {
      return Date.now();
    }
  },
  userId: {
    type: Object,
    required:true
  },
  filePath: {
    type: String,
  }
});

const Files = model("files", fileSchema);

module.exports = {
    Files
 };
