
const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isUserLoggedIn, isOwner, isAuthor} = require("../middleware/middleware.js")
const reviewController = require("../controllers/reviews.js")

//Reviews Route
//post Review route
router.post("/",isUserLoggedIn, validateReview, asyncWrap(reviewController.createReview))

//Delete Review Route
router.delete("/:reviewId",isUserLoggedIn,isAuthor, asyncWrap(reviewController.destroyReview))

module.exports = router