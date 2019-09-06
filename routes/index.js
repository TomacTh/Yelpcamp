var express = require("express");
var router = express.Router();
var passport = require("passport")
var User = require("../models/user")


//=========ROOT PAGE===================================

router.get("/", function(req,res){
  res.render("landing");
})


//================SIGN UPFORM================================

router.get("/register", function(req,res){
  res.render("register",{page: 'register'});
})

//=====================POST THE FORM, CREATE A NEW USER, LOGIN==========================================
router.post("/register", function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser,req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register", {error: err.message});
    } 
    passport.authenticate("local")(req,res, function(){
      req.flash("success", "Welcome to Yelpcamp"+ user.username);
      res.redirect("/campgrounds");
    });
  });
});
//===================LOGIN FORM===============
router.get("/login",function(req,res){
  res.render("login", {page: 'login'});
})

//================LOGIN POST====================

router.post("/login",passport.authenticate("local", 
  {
  successRedirect: "/campgrounds", 
  failureRedirect: "/login" 
  
  }),  function(req,res){
  res.send("IT WORKS")
});

//===================LOGOUT===
router.get("/logout",function(req,res){
  req.logout();
  req.flash("error", "Logged you out!")
  res.redirect("/campgrounds")
})

module.exports = router;