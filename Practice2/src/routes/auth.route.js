const express = require("express");
const { createNewUser, login, getCurrentUser, handleAdmin } = require("../controllers/auth.controller");
const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");
const { sendOtpPhoneNumber, verifyOtpForMobile, sendOtpEmail, verifyOtpForEmail } = require("../controllers/otp.controller");
const router = express.Router();

router.post("/otp-send-phone", sendOtpPhoneNumber);

router.post("/otp-verify-phone", verifyOtpForMobile);

router.post("/otp-send-email", sendOtpEmail);

router.post("/otp-verify-email", verifyOtpForEmail);

router.post("/signup", createNewUser);

router.post("/login", login);

router.get("/dashborad",checkAuth, getCurrentUser);

router.get("/admin/dashboard",checkAuth, checkAdmin, handleAdmin);

module.exports = router;