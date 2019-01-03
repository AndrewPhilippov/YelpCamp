var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var campgrounds = [
  {name: "Salmon Creek", image: "https://images.pexels.com/photos/1239422/pexels-photo-1239422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
  {name: "Granite Hill", image: "https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
  {name: "Mountains goat's rest", image: "https://images.pexels.com/photos/1252399/pexels-photo-1252399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
  {name: "Salmon Creek", image: "https://images.pexels.com/photos/1239422/pexels-photo-1239422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
  {name: "Granite Hill", image: "https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
  {name: "Mountains goat's rest", image: "https://images.pexels.com/photos/1252399/pexels-photo-1252399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
  {name: "Salmon Creek", image: "https://images.pexels.com/photos/1239422/pexels-photo-1239422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
  {name: "Granite Hill", image: "https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
  {name: "Mountains goat's rest", image: "https://images.pexels.com/photos/1252399/pexels-photo-1252399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
];

app.use(bodyParser.urlencoded({ extended:true }));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.render('landing');
})

app.get('/campgrounds', function(req,res){
  res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', function(req, res){
  // Get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  // Redirect to campgrounds page
  res.redirect('/campgrounds');

});

app.get('/campgrounds/new', function(req,res){
  res.render('new');
});

app.listen('8080', '127.0.0.1', function(){
  var date = new Date();
    console.log('Server is listening on \"8080\" at '+ date);
});