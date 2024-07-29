const express = require("express")
const router = express.Router()
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { isUserLoggedIn, validateListing, isOwner } = require("../middleware/middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

router.route("/")
.get(asyncWrap(listingController.index)) //Index Route
.post(isUserLoggedIn,upload.single('listing[image]'), validateListing, asyncWrap(listingController.createListing)); //Create Route

//New Route
router.get("/new", isUserLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(asyncWrap(listingController.showListing)) //Show Route
.put(isUserLoggedIn, isOwner,upload.single("listing[image]"), validateListing, asyncWrap(listingController.updateListing)) //Update Route
.delete(isUserLoggedIn, isOwner, asyncWrap(listingController.destroyListing)); //Delete Route

//Edit Route
router.get("/:id/edit", isUserLoggedIn, isOwner, asyncWrap(listingController.renderEditForm));

module.exports = router  