require('dotenv').config();

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user")
    seedDB = require("./seed"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override")

//===========REQUIRE ROUTES================================
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index")



mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true, useCreateIndex: true 
}).then(() => {
  console.log('connected to DB');
}).catch(err => {
  console.log('ERROR :', err.message)
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedtheDATABASE
//seedDB();

//=============================PASSPORTCONFIGURATION==================================================

app.use(require("express-session")({
  secret: "once again tom is the best",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//=======================================================================================================
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.googleMapsApi = process.env.PLACES_API_KEY;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", authRoutes);


//)========================================================================================
app.listen(process.env.PORT, process.env.IP, function(){
  console.log(`Yelcamp server has started ${process.env}`);
})


