const express = require ('express');
const router = express.Router({mergeParams:true});
const wrapAsync =require('../utils/wrapAsync.js');
const {reviewSchema} =require('../schema.js');
const ExpressError =require('../utils/ExpressError.js');
const { isLoggedIn } = require('../middleware.js');
const {Delete,reviewCnr} = require('../controller/review.js');

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


//Express review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewCnr)
);

//Express review Delete route
router.delete("/:reviewId",wrapAsync(Delete));

module.exports=router;
