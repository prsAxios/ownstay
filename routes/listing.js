const express = require('express');
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const { isLoggedIn, ValidOwner, validateListing } = require('../middleware.js');
const {
    index,
    newListing,
    create,
    show,
    edit,
    update,
    deleteList
} = require('../controller/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');

const router = express.Router();
const upload = multer({ storage });

// Route to list all listings and create a new listing
router.route("/")
    .get(wrapAsync(index)) // List all listings
    .post(
        isLoggedIn, // Ensure the user is logged in
        upload.single("listing[image]"), // Handle file upload
        validateListing, // Validate listing data
        wrapAsync(create) // Create a new listing
    );

// Route to show form for creating a new listing
router.get("/new", isLoggedIn, wrapAsync(newListing));

// Routes for specific listings (show, update, and delete)
router.route("/:id")
    .get(wrapAsync(show)) // Show a specific listing
    .put(
        isLoggedIn, // Ensure the user is logged in
        ValidOwner, // Ensure the user is the owner of the listing
        upload.single("listing[image]"), // Handle file upload
        validateListing, // Validate listing data
        wrapAsync(update) // Update the specific listing
    );

// Route to show form for editing a specific listing
router.get("/:id/edit", isLoggedIn, ValidOwner, wrapAsync(edit));

// Route to delete a specific listing
router.get("/:id/delete", isLoggedIn, ValidOwner, wrapAsync(deleteList));

module.exports = router;
