const express = require("express");
const router = express.Router();

const {
  requireSignin,
  authMiddleware,
  adminMiddleware
} = require("../controllers/auth");

const {
  read,
  publicProfile,
  update,
  photo,
  getWriterProfile
} = require("../controllers/user");

router.get("/user/profile", requireSignin, authMiddleware, read);
router.get("/user/:username", publicProfile);
router.put("/user/update", requireSignin, authMiddleware, update);
router.get("/user/photo/:username", photo);
router.get("/user/writer/:username", getWriterProfile);

// Headers: Authorization: Bearer <token...>

module.exports = router;
