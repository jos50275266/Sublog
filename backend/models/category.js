const mongoose = require("mongoose");

// When querying category, we will be based on slug, so we need to set "index: true"
// new arrival -> slug -> new-arrival
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    slug: {
      type: String,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = {
  Category
};
