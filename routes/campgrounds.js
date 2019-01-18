var express    = require('express');
var router     = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

// ============================
// INDEX - show all campgrounds
// ============================

router.get('/', function(req,res){
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  })
});

// =================================
// CREATE - add new campground to DB
// =================================

router.post('/', middleware.isLoggedIn, function(req, res){
  // Get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: image, description: description, author: author };
  
  // Create a new campground and save to database
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // Redirect to campgrounds page
      console.log(newlyCreated);
      res.redirect('/campgrounds');
    }
  });
});

// ========================================
// NEW - show form to create new campgorund
// ========================================

router.get('/new', middleware.isLoggedIn, function(req,res){
  res.render('campgrounds/new');
});

// ==========
// SHOW ROUTE
// ==========

router.get('/:id', function(req,res){
  // Find the campgound with provided ID
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      // Render show template with that campgound
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

// =====================
// EDIT CAMPGROUND ROUTE
// =====================
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
      res.render('campgrounds/edit', { campground: foundCampground }); 
    });
});

// =======================
// UPDATE CAMPGROUND ROUTE
// =======================
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res){
  // Find and update correct campground

  // One way to collect data from edit form is to create an object
  // var data = {
  //   name: req.body.name,
  //   image: req.body.image,
  //   description: req.body.description
  // }

  // Another way is to edit 'edit' template's name
  var data = req.body.campground;

  Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCampground){
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // Redirect somewhere
      res.redirect('/campgrounds/'+updatedCampground.id);
    }
  });
});

// ========================
// DESTROY CAMPGROUND ROUTE
// ========================
router.delete('/:id', middleware.checkCampgroundOwnership, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    }
    res.redirect('/campgrounds');
  });
});


module.exports = router;