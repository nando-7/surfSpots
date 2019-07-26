var express = require("express");
var router = express.Router();
var SurfSpotsMg = require("../models/surfSpot");
var Comment = require("../models/comment");
var middleware = require("../Middleware");

// COMMENTS ROUTES:



router.get("/surfSpots/:id/comments/new", 
    //the middleware
    middleware.isLoggedIn, 
    function(req, res){
        SurfSpotsMg.findById(req.params.id,function (error, foundSurfSpot){
            if(error){
                console.log(error);
            }
            else{
                
                
                res.render("commentsFormPg.ejs", {surfSpotVar: foundSurfSpot} );
            }
    });
    
    
});


router.post("/surfSpots/:id/comments",
    //middleware on post request as well to keep it really secure
    middleware.isLoggedIn
    ,function(req, res){
    
    //lookup surf spot using ID:
    SurfSpotsMg.findById(req.params.id,function (error, foundSurfSpot){
        if(error){
            console.log(error);
            res.redirect("/" );
        }
        else{ 
         //creating new comment:
          Comment.create(req.body.comment,function (err, commentCreated){
                             if (err){
                                 console.log(err);
                             }
                             else {
                                 console.log(req.body.comment);
                                 console.log(commentCreated);
                                 //add username and id to comment:
                                 commentCreated.author.id = req.user._id;
                                 commentCreated.author.username = req.user.username;
                                 //save comment with id and username:
                                 commentCreated.save();
                                 //and then the code we already had:
                                 
                                 //connect new comment to surf spot:
                                 console.log(commentCreated);
                                 foundSurfSpot.comments.push(commentCreated);
                                 //save whole new comment:
                                 foundSurfSpot.save();
                                 //redirect to show page:
                                 req.flash("success", "Comment added to spot!");
                                 res.redirect("/surfSpots/" + foundSurfSpot._id);
                             } 
          
  
            });
            
        }
        });  
        
 });
 
 
 
 
router.get("/surfSpots/:id/comments/:comment_id/edit", middleware.checkOwnershipComment, function(req, res){
    Comment.findById(req.params.comment_id, function (error, foundComment){
        if(error){
            console.log(error);
            res.redirect("back" );
        }
        else{
            console.log(foundComment);
            res.render("commentsEdit.ejs", {surfSpotIdVar: req.params.id, commentVar: foundComment});
        }
    });
});


router.put("/surfSpots/:id/comments/:comment_id", middleware.checkOwnershipComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,  function (error, updatedComment){
      if(error){
            console.log(error);
            res.redirect("back" );
        }
        else{
            
            console.log(updatedComment.text);
            req.flash("success", "Comment updated!");
            res.redirect("/surfSpots/" + req.params.id );
        }
    });  
});



router.delete("/surfSpots/:id/comments/:comment_id", middleware.checkOwnershipComment, function(req, res){ 
    Comment.findByIdAndRemove(req.params.comment_id, function (error, deleted){
      if(error){
            console.log(error);
        }
        else{
            console.log(deleted);
            req.flash("error", "Comment deleted!");
            res.redirect("/surfSpots/"  + req.params.id);
            console.log("comment deleted");
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

// function checkOwnershipComment (req, res, next){
//     if(req.isAuthenticated()){
//       Comment.findById(req.params.comment_id, function(error, foundComment) {
//           if(error){
//               res.redirect("back");
//           } else{
//               //does user own comment?
//             if(foundComment.author.id.equals(req.user._id)){
                
//                 console.log(foundComment);
//                 next();
              
              
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
 