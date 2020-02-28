// 3rd Party Modules
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// routes
const authRoutes = require("./routes/auth");

// Utils' Modules
const { logger, stream } = require("./utils/logger");

// App
const app = express();

// DB Setup
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

const db = process.env.MONGODB_URI;

mongoose
  .connect(db, options)
  .then(() => logger.info(`Connected to Database ${db}`))
  .catch(err => logger.error("Could not connect to MongoDB..."));

// Middlewares
app.use(morgan("dev", { stream }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// Routes
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
