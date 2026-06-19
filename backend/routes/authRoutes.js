const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");
const authenticateUser = require("../config/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, getProfile);

module.exports = router;
