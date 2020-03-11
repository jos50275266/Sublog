const { User } = require("./models/user");
const { Blog } = require("./models/blog");
const { Tag } = require("./models/tag");
const { Category } = require("./models/category");
const { logger } = require("./utils/logger");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, options);

  await User.deleteMany({});
  await Blog.deleteMany({});
  await Tag.deleteMany({});
  await Category.deleteMany({});

  await mongoose.disconnect();
  logger.info("Done!");
}

seed();

/*
title: abc
body: Hello World
photo: ..
categories: 5e42fc044b920315ac98b3a0
tags: 5e43029828122675d4fb9008
*/
