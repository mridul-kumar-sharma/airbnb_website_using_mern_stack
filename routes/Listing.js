const express = require("express")
const router = express.Router()
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { isUserLoggedIn, validateListing, isOwner } = require("../middleware/middleware.js");


//Index Route
router.get("/", asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isUserLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    console.log(listing)
    if (!listing) {
        req.flash("error", "Listing Does not exist!")
        res.redirect(`/listings`);
    }
    res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/", isUserLoggedIn, validateListing, asyncWrap(async (req, res) => {
    console.log(req.body.listing)
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", isUserLoggedIn, isOwner, asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing)
    if (!listing) {
        req.flash("error", "Listing Does not exist!")
        res.redirect(`/listings`);
    }
    // req.flash("success","Listing edited!")
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id", isUserLoggedIn, isOwner, validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;
    let updatingValue = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(updatingValue);
    req.flash("success", "Listing Edited!")
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", isUserLoggedIn, isOwner, asyncWrap(async (req, res) => {
    let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing Deleted Successfully!")
        res.redirect("/listings");
}));

module.exports = router  