var express       = require('express'),
    app           = express(),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    bodyParser    = require('body-parser'),
    User          = require('./models/user'),
    LocalStrategy = require('passport-local'),
    Comment       = require('./models/comment'),
    Campground    = require('./models/campground'),
    seedDB        = require('./seeds');


mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended:true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();

// ======================
// PASSPORT CONFIGURATION
// ======================

app.use(require('express-session')({
  secret: 'If ou are really passioned about what you do, you can achive the top of the industry',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res, next){
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req,res){
  res.render('landing');
});

// ============================
// INDEX - show all campgrounds
// ============================

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

// =================================
// CREATE - add new campground to DB
// =================================

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

// ========================================
// NEW - show form to create new campgorund
// ========================================

app.get('/campgrounds/new', function(req,res){
  res.render('campgrounds/new');
});

// ==========
// SHOW ROUTE
// ==========

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

// ===============
// COMMENTS ROUTES
// ===============

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req,res){
  // Find campground by ID
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req,res){
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

// ==========
// AUTH ROUTS
// ==========

// Show register form
app.get('/register', function(req,res){
  res.render('register');
})
// Handle sign Up logic
app.post('/register', function(req,res){
  var newUser  = new User({ username: req.body.username }),
      password = req.body.password;
  User.register(newUser, password, function(err, user){
    if(err){
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req,res,function(){
      res.redirect('/campgrounds');
    });
  });
});

// Show login form
app.get('/login', function(req,res){
  res.render('login');
});
// Handling login logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  }), function(req,res){
});

// Add logout route
app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

app.listen('8080', '127.0.0.1', function(){
  var date = new Date();
    console.log('Server is listening on \"8080\" at '+ date);
});