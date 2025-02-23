const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    category: { type: String },
    year: { type: String },
    limit: { type: Number },
    director: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    createdBy: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
