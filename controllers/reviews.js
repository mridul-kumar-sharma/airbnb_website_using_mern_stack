const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new Review saved")
    req.flash("success","New Review Added Successfully!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    console.log(listing)
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    console.log(deletedReview)
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}