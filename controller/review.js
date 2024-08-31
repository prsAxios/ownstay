const Review = require('../models/review.js');
const Listing = require('../models/listing.js');


//Express review route

module.exports.reviewCnr =async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("review saved");
    req.flash("success","review added successfully");
    res.redirect(`/listings/${listing._id}`);
}


//Express review Delete route
module.exports.Delete = async (req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted succesfully");
    res.redirect(`/listings/${id}`);
}