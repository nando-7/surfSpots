var SurfSpotsMg = require ("../models/surfSpot");
var Comment = require("../models/comment");

//all middlewares go here

var middlewareObj = {};

middlewareObj.checkOwnership= function (req, res, next){
    
    if(req.isAuthenticated()){
      SurfSpotsMg.findById(req.params.id, function(error, foundSurfSpot) {
          if(error){
              res.redirect("back");
          } else{
              //does user own surf spot?
            if(foundSurfSpot.author.id.equals(req.user._id)  || req.user && req.user.isAdmin){
              
              next();
            } else{
                 req.flash("error", "Sorry, you're not allowed to do that!");
                 res.redirect("back");
            }
          }
          
      }); 
    } else{
            res.redirect("back");
        }
    
    
};



middlewareObj.checkOwnershipComment= function (req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(error, foundComment) {
          if(error){
              res.redirect("back");
          } else{
              //does user own comment?
            if(foundComment.author.id.equals(req.user._id) || req.user && req.user.isAdmin){
                
                console.log(foundComment);
                next();
              
              
            } else{
                 res.redirect("back");
            }
          }
          
      }); 
    } else{
            res.redirect("back");
        }
    
    
};



middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first! Don't have an account?! Click the Sign Up link and enjoy...");
    res.redirect("/login");
};


module.exports = middlewareObj;