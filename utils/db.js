const { ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");

require("dotenv").config();
const connectDB = async () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    .then(() => {
      console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

module.exports = connectDB;
