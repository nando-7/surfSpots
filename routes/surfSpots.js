
var express = require("express");
var router = express.Router();
var SurfSpotsMg = require("../models/surfSpot");
var Comment = require("../models/comment");
var middleware = require("../Middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX route = display list
router.get("/surfSpots", function(req, res){
    SurfSpotsMg.find({},function(error, yeah){
        if(error){
            console.log(error);
        }
        else{
            
            res.render("surfSpots.ejs", {spotsVar:yeah, currentUserVar: req.user});
        }
    });
    
});

// CREATE = code to create from the new form
router.post("/surfSpots", middleware.isLoggedIn,  function(req, res){
    
    var newSpot = req.body.newSpot;
    var newSpotImg = req.body.newSpotImg;
    var newWave = req.body.newWave;
    var newBreak = req.body.newBreak;
    var newSpotDscp = req.body.newSpotDscp;
    
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
        console.log(err);
      req.flash('error', 'Invalid address');
      
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    
    SurfSpotsMg.create(
    {name: newSpot, img: newSpotImg, description: newSpotDscp, wave: newWave, breakType: newBreak, author: author, location: location, lat: lat, lng: lng}, function (error, xxx){
        if(error){
            console.log(error);
        }
        else{
            console.log(xxx);
            req.flash("success", "Surf Spot successfully added!");
            res.redirect("/surfSpots");
        }
    });

    //old way with the array
    //surfSpots.push({name: newSpot, img: newSpotImg});
    
    });  
});

//NEW route = form to make new one
router.get("/surfSpots/new", middleware.isLoggedIn, function(req, res){
    res.render("formPg.ejs");
});

// SHOW = show info about each item (must be after NEW!)
router.get("/surfSpots/:id", function(req, res){
    SurfSpotsMg.findById(req.params.id
    
    //the .populate code (added at the 7min of lesson 326) is to transform the comments id into their actually data
    //, this coma to separe one to another before having the comments code
    //and the line below must be taken out for the previous code to work
    
    ).populate("comments").exec(
    function (error, foundSurfSpot){
        if(error){
            console.log(error);
        }
        else{
            
            //to see how the .populate get inserted into the surfspot schema!
            //console.log(foundSurfSpot);
            
            res.render("show.ejs", {surfSpotVar: foundSurfSpot} );
        }
    });
    
    
});


router.get("/surfSpots/:id/edit", middleware.checkOwnership, function(req, res){
    
    SurfSpotsMg.findById(req.params.id, function (error, foundSurfSpot){
        if(error){
            console.log(error);
        }
        else{
            res.render("edit.ejs", {surfVar: foundSurfSpot} );
        }
    });
});



router.put("/surfSpots/:id", middleware.checkOwnership, function(req, res){ 
    
    //req.body.blog.body = req.sanitize(req.body.blog.body);
    
    geocoder.geocode(req.body.surfSpot.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.surfSpot.lat = data[0].latitude;
    req.body.surfSpot.lng = data[0].longitude;
    req.body.surfSpot.location = data[0].formattedAddress;
        
    SurfSpotsMg.findByIdAndUpdate(req.params.id, req.body.surfSpot,  function (error, updatedSurfSpot){
      if(error){
            console.log(error);
        }
        else{
            
            console.log(updatedSurfSpot.name);
            req.flash("success", "Spot updated!");
            res.redirect("/surfSpots/" + req.params.id );
        }
    }); 
    
    });
   
});


router.delete("/surfSpots/:id", middleware.checkOwnership, function(req, res){ 
    SurfSpotsMg.findByIdAndRemove(req.params.id, function (error, deleted){
      if(error){
            console.log(error);
        }
        else{
            req.flash("error", "Spot deleted!");
            res.redirect("/surfSpots");
            console.log("deleted");
        }
    });  
});





//middleware function!!! (now in separate folder)

// function isLoggedIn (req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }



// another middleware function!!! (now in separate folder)
// function checkOwnership (req, res, next){
//     if(req.isAuthenticated()){
//       SurfSpotsMg.findById(req.params.id, function(error, foundSurfSpot) {
//           if(error){
//               res.redirect("back");
//           } else{
//               //does user own surf spot?
//             if(foundSurfSpot.author.id.equals(req.user._id)){
              
//               next();
//             } else{
//                  res.redirect("back");
//             }
//           }
          
//       }); 
//     } else{
//             res.redirect("back");
//         }
    
    
// }



module.exports = router;