var express = require('express');
var app = express();
app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.render('landing');
})

app.get('/campgrounds', function(req,res){
  var campgrounds = [
    {name: "Salmon Creek", image: "https://images.pexels.com/photos/1239422/pexels-photo-1239422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    {name: "Granite Hill", image: "https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    {name: "Mountains goat's rest", image: "https://images.pexels.com/photos/1252399/pexels-photo-1252399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
  ];

  res.render('campgrounds', { campgrounds: campgrounds });
});

app.listen('8080', '127.0.0.1', function(){
    console.log('Server is listening on \"8080\"');
});