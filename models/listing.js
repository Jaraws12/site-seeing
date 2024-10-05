const mongoose=require("mongoose");
const Review=require("./reviews.js")
const listingschema=new mongoose .Schema({
    title:{
        type:String,
         required:true
        },
    description:String,
    image:{
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1676648534973-dd205cb63d99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZGVzdGluYXRpb258ZW58MHx8MHx8fDA%3D",
        set:(v)=>v===""?"https://plus.unsplash.com/premium_photo-1676648534973-dd205cb63d99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZGVzdGluYXRpb258ZW58MHx8MHx8fDA%3D":v,

    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
  type: mongoose.Schema.Types.ObjectId,
  ref:"User"
    }
});



listingschema.post("findOneAndDelete", async(listing)=>{
await Review.deleteMany({_id:{$in:listing.reviews}})
})
const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;