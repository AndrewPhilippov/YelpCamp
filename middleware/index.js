var Campground = require('../models/campground');
var Comment = require('../models/comment');

// All the middleware goes here
var middlewareObj = {};
  middlewareObj.checkCampgroundOwnership = function(req,res,next){
        // Is user logged in
    if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
          res.redirect('back');
        } else {
          // Does user have campground
          if(foundCampground.author.id.equals(req.user._id)){
            next();
          } else {
            // Otherwise, redirect
            // If not - redirect user
            res.redirect('back');
            // res.redirect('/campgrounds/'+foundCampground.id);
          }
        }
      });
    } else {
      res.redirect('back'); 
    }
  };
  middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          console.log(err);
        } else {
          // does the user own the comment?
          if(foundComment.author.id.equals(req.user._id)){
            next();
          } else {
            res.redirect('back');
          }
        }
      });
    }
  };
  middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login');
  }

module.exports = middlewareObj;