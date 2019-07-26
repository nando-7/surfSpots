var mongoose = require("mongoose");
var SurfSpotsMg = require ("./models/surfSpot");
var Comment = require("./models/comment");

var data = [
    {
    name:"The Gong - Oz Land", 
    img : "https://www.visitnsw.com/sites/visitnsw/files/styles/gallery_full_width/public/2017-11/Surf_at_the_Farm_ShellharbourVIC.jpg?itok=ERaGsS-U",
    description: "Amazing waves for experienced surfers - point and beach breaks" 
    },
    {
    name:"lap", 
    img : "https://stabmag.com/assets/Uploads/2014/01/coco_Ho_Laserwolf.jpg",
    description: "uhummmmm" 
    },
    {
    name:"blup", 
    img : "https://www.ocregister.com/wp-content/uploads/migration/oks/oks2t1-b88880440z.120170202185328000ghpldp08.10.jpg",
    description: "entendelllll" 
    }
    ];



function seedDB(){
    //remove all surf spots:
    SurfSpotsMg.remove({}, function(err){
    if(err){
        console.log(err);
    }
    // console.log("removed surfspots");
    // //adding surfspots:
    // data.forEach(function(seed){
    //     SurfSpotsMg.create(seed, function(err, data){
    //          if(err){
    //              console.log(err);
    //             }
    //          else {
    //              console.log("added db"); 
                 
    //              //creating comments:
    //              Comment.create(
    //                      {
    //                          text: "Amazing surfspot!!!",
    //                          author: "Soy Yo"
    //                      }, function (err, comment){
    //                          if (err){
    //                              console.log(err);
    //                          }
    //                          else {
    //                              data.comments.push(comment);
    //                              data.save();
    //                              console.log("Created new fcking comment");
    //                          }
                         
    //                  });
    //          }   
    //     });
    // });
});

    
    
}

module.exports = seedDB;