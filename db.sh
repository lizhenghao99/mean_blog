use BlogServer

var pfile = cat('./posts.json');
var ps = JSON.parse(pfile);
db.Posts.insertMany(ps)

var ufile = cat('./users.json');
var us = JSON.parse(ufile);
db.Users.insertMany(us)