const Listing = require ('./models/listing.js');
const {listingSchema} = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl_p = req.originalUrl;
        req.flash("error","Signup or Login to create listing");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveUrl=((req,res,next)=>{
    if(req.session.redirectUrl_p){
        res.locals.redirectUrl = req.session.redirectUrl_p;
     }
     next();
});

module.exports.ValidOwner= async(req,res,next)=>{
    const { id } = req.params;
    let  upListing = await Listing.findById(id);
    console.log(upListing.owner._id);
    if(!res.locals.currentUser._id.equals(upListing.owner._id)){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${id}`);
    }
  next();
};

// Middleware for validating listings
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};