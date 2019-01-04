var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', { useNewUrlParser: true });

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// Mongoose Model
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//   {
//     name: "Granite Hill", 
//     image: "https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//     description: "Absolutely lovely campground with no water and electricity, fresh air and pure sky..."
//   }, function(err, campground){
//     if(err){
//       console.log(err);
//     } else {
//       console.log('Newly created campgound:');
//       console.log(campground);
//     }
//   });



app.use(bodyParser.urlencoded({ extended:true }));
app.set('view engine', 'ejs');

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
      res.render('campgrounds', { campgrounds: allCampgrounds });
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
  res.render('new');
});

// SHOW - 
app.get('/campgrounds/:id', function(req,res){
  // Find the campgound with provided ID
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      // Render show template with that campgound
      res.render('show', {campground: foundCampground});
    }
  });
});

app.listen('8080', '127.0.0.1', function(){
  var date = new Date();
    console.log('Server is listening on \"8080\" at '+ date);
});