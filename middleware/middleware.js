const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js")

// User authentication method in passport
const isUserLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("error", "You must be logged in to proceed further");
    return res.redirect("/login");
  }
  next();
}

// Validation schema function middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next()
  }
}

//Review Handling Middleware
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else {
    next()
  }
}

//To track the requested url after login process
const saveRedirectURL = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
}

//Check the owner before editing , updating and deleting
const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
  console.log(listing);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this Listing");
    return res.redirect(`/listings/${id}`)
  }
  next();
}

//Check the author of the review before deleting it
const isAuthor = async (req, res, next) => {
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId)
  console.log(review);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this Review");
    return res.redirect(`/listings/${id}`)
  }
  next();
}

module.exports = { isUserLoggedIn, validateListing, validateReview, saveRedirectURL, isOwner , isAuthor};
