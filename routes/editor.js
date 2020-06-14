var express = require('express');
var router = express.Router();

var createError = require('http-errors');
let jwt = require('jsonwebtoken');
let users = require('../models/users');


/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.cookies.jwt) {
        console.log("no cookie");
        return res.redirect('/login?redirect=/editor/');
    } else {
        jwt.verify(req.cookies.jwt, 
            "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c", 
            (err, token) => {
                if (!token || !token.user) {
                    return res.redirect('/login?redirect=/editor/');
                }
                users.find({username: token.user})
                .then(data => {
                    if (data.length === 0) {
                        return res.redirect('/login?redirect=/editor/');
                    } else {
                        next();
                    }
                });
            });
    }
});

module.exports = router;
