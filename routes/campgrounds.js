var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

var middleware = require("../middleware");

//==============================================INDEX================================================
router.get("/",function(req,res){
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Campground.find({name: regex}, function(err, campgrounds){
      if(err){
        console.log(err)
      } else {
          if(campgrounds.length < 1) {
            req.flash("error", "Campground no found");
            return res.redirect("back");
          }
          res.render("campgrounds/index", {campgrounds: campgrounds})
      } 
    });
  } else {
    Campground.find({}, function(err, campgrounds){
      if(err){
        console.log(err)
      } else {
        res.render("campgrounds/index", {campgrounds: campgrounds})
      } 
    });
  }
  
})

//============================CREATE=====================================================
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
//=============================NEW========================================================
router.get("/new", middleware.isLoggedIn, function(req,res){
res.render("campgrounds/new");
})

//=======================SHOW==============================================================

router.get("/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err)
    } else {
      console.log(foundCampground)
      res.render("campgrounds/show", {campground: foundCampground})
    }
  })
})

//===================EDIT======================================================================
router.get("/:id/edit",middleware.checkCampgroundOwner, function(req,res){
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground });
  })
  
})

//=================UPDATE=========================================================================
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//============DELETE===============================================================================
router.delete("/:id",middleware.checkCampgroundOwner, function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
        res.redirect("/campgrounds");
    } else {
        res.redirect()
    } 
  })
})

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;