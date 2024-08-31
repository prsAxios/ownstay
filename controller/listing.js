const Listing = require('../models/listing.js');

// Index Route - Show all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// New Route - Show form to create a new listing
module.exports.newListing = (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
};

// Create Route - Create a new listing
module.exports.create = async (req, res) => {
    if(!req.file){
        return res.status(400).send('no file uploaded');
    }
       let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.image={
        url,
        filename
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

// Show Route - Show a specific listing
module.exports.show = async (req, res) => {
    const { id } = req.params;
    const thisListing = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');

    if (!thisListing) {
        req.flash("error", "Listing does not exist");
        return res.redirect('/listings');
    }

    console.log(thisListing);
    res.render("listings/show.ejs", { thisListing });
};

// Edit Route - Show form to edit a specific listing
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const editListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
};

// Update Route - Update a specific listing
module.exports.update = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
        new: true,
        runValidators: true,
    });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image={url,filename};
        await updatedListing.save();
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
    }
   
};

// Delete Route - Delete a specific listing
module.exports.deleteList = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
