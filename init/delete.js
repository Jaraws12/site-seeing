const mongoose=require("mongoose");
//const indata=require("./data.js");
const Review=require("../models/reviews.js");


main().then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

 
}
const initdb =async()=>{
  await Review.deleteMany({});
  //await Review.insertMany(indata.data);
  console.log("data was initalised");
}
initdb();