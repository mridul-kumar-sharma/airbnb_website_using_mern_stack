// const express = require("express")
// const router = express.Router()
// const asyncWrap = require("../utils/asyncWrap.js");
// const User = require("../models/user.js");
// const passport = require("passport");

// router.get("/signup",(req,res)=>{
//     res.render("auth/signup")
// })

// router.post("/signup",asyncWrap(async(req,res)=>{
//     try{
//         let {username, email, password} = req.body;
//         let newUser = new User({username, email})
//         let savedUser = await User.register(newUser,password);
//         console.log(savedUser)
//         req.flash("success","Welcome to Wanderlust")
//         res.redirect(`/listings`)
//     }
//     catch(e){
//         req.flash("error",e.message);
//         res.redirect("/signup");
//     }
//     }))



// router.get("/login",(req,res)=>{
//     res.render("auth/login.ejs")
// })

// router.post("/login",passport.authenticate('local', {failureRedirect: '/login', failureFlash:true}),asyncWrap(async(req,res)=>{
//     req.flash("success","Welcome back to WanderLust!");
//     res.redirect(`/listings`)
// }))
// module.exports = router;

const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

router.post("/signup", asyncWrap(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let savedUser = await User.register(newUser, password);
        console.log(savedUser);
        req.flash("success", "Welcome to Wanderlust");
        res.redirect(`/listings`);
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

router.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), asyncWrap(async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    res.redirect(`/listings`);
}));

module.exports = router;
