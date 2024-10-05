const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js")
module.exports.creatreview= async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success"," Review created");
    res.redirect(`/listings/${listing._id}`);
 }



 module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success"," Review deleted");
    res.redirect(`/listings/${id}`)
}