var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/blog_demo', {useNewUrlParser:true});

var postSchema = new mongoose.Schema({
  title: String,
  content: String
});

var Post = mongoose.model('Post', postSchema);
var userSchema = new mongoose.Schema({
  email: String,
  name: String,
  posts: [postSchema]
});

var User = mongoose.model('User', userSchema);

// User.findOne({name: 'Jamal Bambarayya'}, function(err,user){
//   if(err){
//     console.log(err)
//   } else {
//     user.posts.push({
//       title: 'Hambumba-djumba',
//       content: 'Samburesco every minute'
//     });
//     user.save(function(err,user){
//       if(err){
//         console.log(err);
//       } else {
//         console.log(user);
//       }
//     });
//   }
// });

// var newUser = new User({
//   email: 'jamal@gmail.com',
//   name: 'Jamal Bambarayya'
// });

// newUser.posts.push({
//   title: "How to bambala jiudgitsu?",
//   content: "Nothing special - joomba-boomba and freeaway!"
// });

// newUser.save(function(err, user){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });

// var newPost = new Post({
//   title: 'Reflection on apples',
//   content: 'They are deliciouse'
// });
// newPost.save(function(err, post){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// })

// var newUser = new User({
//   email: 'philippov55@gmail.com',
//   name: 'Andrew Philippov'
// });

// newUser.save(function(err, user){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// })