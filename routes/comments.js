var express     = require('express');
var router      = express.Router({ mergeParams: true });

var Campground  = require('../models/campground');
var Comment     = require('../models/comment');
var middleware  = require('../middleware');

// Comments new
router.get('/new', middleware.isLoggedIn, function(req,res){
  // Find campground by ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

// Comments create
router.post('/', middleware.isLoggedIn, function(req,res){
  // Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
  // Create new comment
  Comment.create(req.body.comment, function(err,comment){
    if(err){
      req.flash('error', 'Somethig went wrong');
      console.log(err);
    } else {
      // Add username and ID to comments
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      // console.log('New comment username - ' + req.user.username);
      // Save comment
      comment.save();
      // Connect new comment to campground
      campground.comments.push(comment);
      campground.save();

      req.flash('success', 'Your comment successfuly added! Thx.');
      // Redirect to campground showpage
      res.redirect('/campgrounds/'+campground._id);
    }
  });
    }
  });
});

// Comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) { 
    if(err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  }); 
});
// Comments update
router.put('/:comment_id', middleware.checkCommentOwnership, function(req,res){
  var data = req.body.comment;

  Comment.findByIdAndUpdate(req.params.comment_id, data, function(err, updatedComment){
    if(err){
      console.log(err);
      res.redirect('back');
    } else {
      // Redirect somewhere
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});

// Delete comment
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req,res){
  // FindById and remove
  Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
    if(err){
      console.log(err);

      res.redirect('back');
    } else {
      req.flash('success', 'The comment has been successfuly deleted!');
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});


module.exports = router;