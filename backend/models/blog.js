const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// slug: {index: true} because we will query based on slug
// type: {} means you can put any types of data
// excerpt Snippnt like title
// mtitle = metaTitle mdesc = metaDescription
const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      index: true
    },
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true
    },
    body: {
      type: {},
      required: true,
      max: 2000000
    },
    excerpt: {
      type: String,
      max: 1000
    },
    mtitle: {
      type: String
    },
    mdesc: {
      type: String
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    categories: [{ type: ObjectId, ref: "Category", required: true }],
    tags: [{ type: ObjectId, ref: "Tag", required: true }],
    postedBy: {
      type: ObjectId,
      ref: "User"
    },
    like: {
      type: [{ type: ObjectId, ref: "User" }]
    }
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = {
  Blog
};
