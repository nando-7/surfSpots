require('dotenv').config();

var express = require("express");
var app = express();
//var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var localStrategy = require("passport-local");
var flash = require("connect-flash")

//separete because was added after addind the models folder (vd:322)
var SurfSpotsMg = require ("./models/surfSpot");

//separete because was added after creating seeds.js
var seedDB = require("./seeds");

//to make the post comment route work
var Comment = require("./models/comment");

//to import models user
var User = require("./models/user");

var commentsRoutes = require("./routes/comments");
var surfSpotsRoutes = require("./routes/surfSpots");
var authRoutes = require("./routes/auth");

//to be able to use the public directory (css,...) 
//__dirname just secure that comes from where your app.js is
app.use(express.static( "public"));
//__dirname +

//calling the function from seeds.js
//seedDB();


var pwd = process.env.DBATLASPWD

//mongoose.connect("mongodb://localhost/surf_spot");
mongoose.connect("mongodb+srv://kellyMedina:" + pwd + "@surfspot-9pfyy.mongodb.net/test?retryWrites=true&w=majority");



//body parser takes the request and turn into a useable 
//java script object ;)
app.use(bodyParser.urlencoded({extended: true}));

//to be able to edit and delete the database
app.use(methodOverride("_method"));

//to print when was posted the spot or comment
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "One life, no fear",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash messages
app.use(flash());


//created middlewareS that makes the variables currentUserVar, flash... available in all routes
app.use(function(req, res, next){
    
    res.locals.currentUserVar = req.user;
    
    res.locals.flashVarError = req.flash("error");
    res.locals.flashVarSuccess = req.flash("success");
    
    next();
});





// SurfSpotsMg.create(
//     {name:"The Gong - Oz Land", 
//     img : "https://www.visitnsw.com/sites/visitnsw/files/styles/gallery_full_width/public/2017-11/Surf_at_the_Farm_ShellharbourVIC.jpg?itok=ERaGsS-U",
//     description: "Amazing waves for experienced surfers - point and beach breaks"   
//     }, function (error, xxx){
//         if(error){
//             console.log(error);
//         }
//         else{
//             console.log(xxx);
//         }
//     });




// var surfSpots = [{name:"Snapper", img : "https://stabmag.com/assets/Uploads/2014/01/Azad_0G7A1534.jpg"},
//                         {name:"Green Bowl - Indonesia", img : "http://static.asiawebdirect.com/m/bangkok/portals/bali-indonesia-com/homepage/magazine/green-bowl-beach/pagePropertiesImage/green-bowl-beach.jpg.jpg"},
//                         {name:"Macumba", img: "https://www.viagenspossiveis.com.br/wp-content/uploads/2016/02/Praia-da-Macumba-5.jpg"},
//                         {name:"The Gong - Oz Land", img: "https://www.visitnsw.com/sites/visitnsw/files/styles/gallery_full_width/public/2017-11/Surf_at_the_Farm_ShellharbourVIC.jpg?itok=ERaGsS-U"}];
    




app.use(commentsRoutes);
app.use(surfSpotsRoutes);
app.use(authRoutes);



 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
