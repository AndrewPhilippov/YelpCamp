var express          = require('express'),
    app              = express(),
    mongoose         = require('mongoose'),
    passport         = require('passport'),
    bodyParser       = require('body-parser'),
    User             = require('./models/user'),
    LocalStrategy    = require('passport-local'),
    methodOverride   = require('method-override'),
    Comment          = require('./models/comment'),
    Campground       = require('./models/campground'),
    flash            = require('connect-flash'),
    seedDB           = require('./seeds');

// Requiring routes
var campgroundRoutes = require('./routes/campgrounds.js'),
    commentRoutes    = require('./routes/comments.js'),
    indexRoutes      = require('./routes/index.js');

// mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', { useNewUrlParser: true });
mongoose.connect('mongodb://andrew:philippov1@ds261644.mlab.com:61644/yelpcamp');

app.use(bodyParser.urlencoded({ extended:true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
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
  res.locals.error       = req.flash('error');
  res.locals.success     = req.flash('success');
  next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/', indexRoutes);


app.listen(process.env.PORT || '8080', process.env.ID || '127.0.0.1', function(){
  var date = new Date();
    console.log('Server is listening on \"8080\" at '+ date);
});