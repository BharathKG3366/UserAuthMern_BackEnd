const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    collection: "verifyUser",
  }
);

module.exports = mongoose.model("verifyUser", verifySchema);
