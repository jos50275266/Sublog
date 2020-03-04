const { User } = require("./models/user");
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

  mongoose.disconnect();
  logger.info("Done!");
}

seed();
