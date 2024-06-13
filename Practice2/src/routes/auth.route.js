const express = require("express");
const { createNewUser, login, getCurrentUser, handleAdmin } = require("../controllers/auth.controller");
const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");
const { sendOtpPhoneNumber, verifyOtp } = require("../controllers/otp.controller");
const router = express.Router();

router.post("/verify", sendOtpPhoneNumber);

router.post("/otp-verify", verifyOtp);

router.post("/signup", createNewUser);

router.post("/login", login);

router.get("/dashborad",checkAuth, getCurrentUser);

router.get("/admin/dashboard",checkAuth, checkAdmin, handleAdmin);

module.exports = router;