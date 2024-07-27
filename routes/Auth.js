const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware/middleware.js");


//Signup Get Route
router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

//Signup Post Route
router.post("/signup", asyncWrap(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let savedUser = await User.register(newUser, password);
        console.log(savedUser);
        req.login(savedUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            return res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//Login Get Route
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

//Login Post Route
router.post("/login",saveRedirectURL, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), asyncWrap(async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectURL;
    if(redirectUrl){
        res.redirect(res.locals.redirectURL);
    }
    else{
        res.redirect("/listings");
    }
}));


//Logout Get Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    })
})

module.exports = router;
