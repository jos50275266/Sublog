const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
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
router.get("/signout", signout);

router.get("/secret", requireSignin, (req, res, next) => {
  res.json({
    message: "비밀 페이지에 접근했습니다."
  });
});

module.exports = router;
