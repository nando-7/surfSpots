require('dotenv').config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var localStrategy = require("passport-local");
var flash = require("connect-flash")


var SurfSpotsMg = require ("./models/surfSpot");


var seedDB = require("./seeds");


var Comment = require("./models/comment");


var User = require("./models/user");

var commentsRoutes = require("./routes/comments");
var surfSpotsRoutes = require("./routes/surfSpots");
var authRoutes = require("./routes/auth");


app.use(express.static( "public"));



var pwd = process.env.DBATLASPWD

//mongoose.connect("mongodb://localhost/surf_spot");
mongoose.connect("mongodb+srv://kellyMedina:" + pwd + "@surfspot-9pfyy.mongodb.net/test?retryWrites=true&w=majority");




app.use(bodyParser.urlencoded({extended: true}));


app.use(methodOverride("_method"));


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


//created middlewareS available in all routes
app.use(function(req, res, next){
    
    res.locals.currentUserVar = req.user;
    
    res.locals.flashVarError = req.flash("error");
    res.locals.flashVarSuccess = req.flash("success");
    
    next();
});



app.use(commentsRoutes);
app.use(surfSpotsRoutes);
app.use(authRoutes);



 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
