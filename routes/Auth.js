const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware/middleware.js");
const authController = require("../controllers/auth.js")

//SignUp route
router.route("/signup")
.get(authController.renderSignupForm)
.post(asyncWrap(authController.signup));

//Login Route
router.route("/login")
.get(authController.renderLoginForm )
.post(saveRedirectURL, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), asyncWrap(authController.login));

//Logout Get Route
router.get("/logout", authController.logout)

module.exports = router;
