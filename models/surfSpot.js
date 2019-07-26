
var mongoose = require("mongoose");


var surfspotSchema = new mongoose.Schema({
    name: String,
    img: String,
    description: String,
    wave: String,
    breakType: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "theOne"
        },
        username: String
        },
    comments: [
        {
        //code to copy the coment schema to the root schema!
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
        }
        ]
});

//var SurfSpotsMg = mongoose.model("surfSpot", surfspotSchema);
module.exports = mongoose.model("surfSpot", surfspotSchema);

