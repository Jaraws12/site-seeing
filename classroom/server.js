const express=require("express");
const app=express();
const session=require("express-session")
const flash=require("connect-flash");
const path=require("path");
app.use(session({
    secret: 'supersecret',
    resave:false,
    saveUninitialized:true
}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine","ejs");
app.use(flash());
app.get("/register",(req,res)=>{
    let {name="anonymos"}=req.query;
    req.session.name=name;
    req.flash("success","user registered");
    res.redirect("/hello");

})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name , msg:req.flash("success")});
})




// app.get("/reqcnt",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`you sent request ${req.session.count} times`)
// })
// app.get("/test",(req,res)=>{
//     res.send("test sucessful")
// })
app.listen(3000,()=>{
    console.log("app is listining to port 8080");
})