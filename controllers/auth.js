const User = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("auth/signup");
}

module.exports.signup = async (req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render("auth/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectURL;
    if(redirectUrl){
        res.redirect(res.locals.redirectURL);
    }
    else{
        res.redirect("/listings");
    }
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    })
}