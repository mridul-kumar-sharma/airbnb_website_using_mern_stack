// const express = require("express")
// const router = express.Router({ mergeParams: true })
// const Review = require("../models/review.js")
// const {reviewSchema} = require("../schema.js")
// const asyncWrap = require("../utils/asyncWrap.js");
// const ExpressError = require("../utils/ExpressError.js");
// const Listing = 
const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");

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

//Reviews Route
//post Review route
router.post("/", validateReview, asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new Review saved")
    req.flash("success","New Review Added Successfully!")
    res.redirect(`/listings/${id}`);
}))

//Delete Review Route
router.delete("/:reviewId", asyncWrap(async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    console.log(listing)
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    console.log(deletedReview)
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}))

module.exports = router