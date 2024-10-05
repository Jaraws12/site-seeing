const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    const alllisting= await Listing.find({});
    res.render('listings/index.ejs',{alllisting});
}

module.exports.rendernewform=(req,res)=>{
    if(req.isAuthenticated()){
    res.render("listings/new.ejs");
    }
    else{
        req.flash("success","you must be logged-in");
        res.redirect("/login");
    }
}



module.exports.showroute=async (req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    
    if(req.isAuthenticated()){
        res.render("listings/show.ejs",{listing});
        }
        else{
            req.flash("success","you must be logged-in");
            console.log(listing);
            res.redirect("/login");
        }
        };

        module.exports.editroute=async (req,res)=>{
            let {id}= req.params;
            const listing= await Listing.findById(id);
        
            if(req.isAuthenticated()){
                res.render("listings/edit.ejs",{listing});
                }
                else{
                    req.flash("success","you must be logged-in");
                    res.redirect("/login");
                }
        
        
        
            
        }
        module.exports.updatelisting=async(req,res)=>{
            let {id}= req.params;
            let {title,description,image,price,location,country}=req.body;
            await Listing.findByIdAndUpdate(id,{...req.body});
           res.redirect("/listings");
        }


        module.exports.deletelisting=async(req,res)=>{
            let {id}= req.params;
           let list= await Listing.findByIdAndDelete(id);
           console.log(list);
           req.flash("success"," Listing Deleted");
            res.redirect("/listings");
        }
        
        
       