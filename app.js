

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path = require('path');
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAcyn.js")
const ExpressError=require("./utils/ExpressError.js")
const Review=require("./models/reviews.js")
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStatergy=require("passport-local");
const User=require("./models/user.js");
//const user = require("./models/user.js");
//const passport = require("passport");
const listingcontroller=require("./controller/listing.js");
const reviewcontroller=require("./controller/reviews.js");


main().then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

 
}
app.set('views', path.join(__dirname, 'views'));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));


// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// });


app.use(session({
    secret: 'supersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
   res.locals.currentuser=req.user;
    next();
});





// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//     email:"swaraj@gmail.com",
//     username:"swaraj"
//     });
//    let registereduser=await User.register(fakeuser,"helloji123");
//    res.send(registereduser);

// })


//index route
app.get("/listings",wrapAsync(listingcontroller.index));
//new route
app.get("/listings/new",listingcontroller.rendernewform);
//show route

app.get("/listings/:id",wrapAsync(listingcontroller.showroute));




app.post("/listings",wrapAsync(async(req,res,next)=>{
   let {title,description,image,price,location,country}=req.body;
    const newlisting=new Listing({
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country,
        owner:req.user._id
    });
  //  console.log(req.user);
   // newlisting.owner=req.user._id;
   await newlisting.save().then((res)=>{
    console.log(res);
   });
   req.flash("success","New Listing Created");
   res.redirect("/listings");

  
    
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(listingcontroller.editroute));
//update route
app.put("/listings/:id",wrapAsync(listingcontroller.updatelisting));
//delete route
app.delete("/listings/:id",wrapAsync(listingcontroller.deletelisting))
//reviews
app.post("/listings/:id/reviews",reviewcontroller.creatreview);
//delete review route
app.delete("/listings/:id/reviews/:reviewid",wrapAsync(reviewcontroller.deletereview));

//signup form
app.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
app.post("/signup",async(req,res)=>{
    try{ 
        let {username,email,password}=req.body;
        
        const newuser =new User({email,username});
       let registuser= await User.register(newuser,password);
       console.log(registuser);
       req.login(registuser,()=>{
        req.flash("success","Welcome To Wonderlust");
        res.redirect("/listings");
       })
      
    }
       catch(e){
        req.flash("success",e.message);
        res.redirect("/signup");
       }
   
});


//login route

app.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

app.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true} ),async(req,res)=>{
    console.log(req.body);
req.flash("success","welcome");
res.redirect("/listings");
});




//logout route

app.get("/logout",(req,res)=>{
    req.logout(()=>{
        req.flash("success","you are logged out");
        res.redirect("/listings")
    })
})




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})

app.use((err,req,res,next)=>{
    let{status=404,message="something went wrong"}=err;
    res.render("error.ejs",{message});
})


app.listen(8080,()=>{
    console.log("app is listining to port 8080");
})



// username=swarajji
//password for deployment=MoMBdpXHiqw7Woj5
//    mongodb+srv://swarajji:MoMBdpXHiqw7Woj5@cluster0.6hfnkvd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0