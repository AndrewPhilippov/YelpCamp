var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    User       = require('./models/user'),
    seedDB     = require('./seeds');


mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended:true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();


app.get('/', function(req,res){
  res.render('landing');
})


// INDEX - show all campgrounds
app.get('/campgrounds', function(req,res){
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  })
});

// CREATE - add new campground to DB
app.post('/campgrounds', function(req, res){
  // Get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description};
  // Create a new campground and save to database
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // Redirect to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

// NEW - show form to create new campgorund
app.get('/campgrounds/new', function(req,res){
  res.render('campgrounds/new');
});

// SHOW - 
app.get('/campgrounds/:id', function(req,res){
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

app.get('/campgrounds/:id/comments/new', function(req,res){
  // Find campground by ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', function(req,res){
  // Lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    } else {
  // Create new comment
  Comment.create(req.body.comment, function(err,comment){
    if(err){
      console.log(err);
    } else {
      // Connect new comment to campground
      campground.comments.push(comment);
      campground.save();
      // Redirect to campground showpage
      res.redirect('/campgrounds/'+campground._id);
    }
  });
    }
  });
});

app.listen('8080', '127.0.0.1', function(){
  var date = new Date();
    console.log('Server is listening on \"8080\" at '+ date);
});