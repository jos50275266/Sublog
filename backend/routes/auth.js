const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  logout,
  requireSignin
} = require("../controllers/auth");

// validators
const { runValidation } = require("../validators/index");
const {
  userSignupValidator,
  userSigninValidator
} = require("../validators/auth");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/logout", logout);

module.exports = router;
