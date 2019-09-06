var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [
  { 
    name: "Moutain camp", 
    image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

  }, 
  { 
    name: "Cloud's Rest", 
    image: "https://farm7.staticflickr.com/6026/5963058057_7347f7c7fc.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

  },  
  { 
    name: "Cool valley", 
    image: "https://farm8.staticflickr.com/7268/7121859753_e7f787dc42.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

  }
]


function seedDB(){
  //REMOVEallcampground
  Campground.remove({},function(err){
    if(err){
      console.log(err);
    }
      console.log("removed campgrounds !");
      //Add a few campgrounds
      data.forEach(function(seed){
        Campground.create(seed,function(err,campground){
          if(err){
              console.log(err);
          } else {
              console.log("added a campground");
              //create a comment
              Comment.create(
                {
                  text: "This place is great, but I wish there was Internet",
                  author: "home"
                }, function(err, comment){
                    if(err){
                        console.log(err)
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created a new comment")
                    }
                    
                });
                
          }
        });
      });
  });
  
  
  //Add a few comments
}

module.exports = seedDB;