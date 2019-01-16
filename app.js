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

// Requiring routes
var campgroundRoutes = require('./routes/campgrounds.js'),
    commentRoutes    = require('./routes/comments.js'),
    indexRoutes      = require('./routes/index.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended:true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Use it to seed the database
// seedDB();

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

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/', indexRoutes);


app.listen('8080', '127.0.0.1', function(){
  var date = new Date();
    console.log('Server is listening on \"8080\" at '+ date);
});