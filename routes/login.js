var express = require('express');
var router = express.Router();

var createError = require('http-errors');

let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let users = require('../models/users');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { redirect: req.query.redirect,
                            success: false,
                            failure: false });
});

router.post('/', function(req, res, next) {
    if (req.headers['content-type'] == 'application/x-www-form-urlencoded'
        && req.body.username && req.body.password) {
        let success = false;
        users.find({username: req.body.username})
        .then((data) => {
            if (data.length !== 0) {
                bcrypt.compare(req.body.password, data[0].password).then((success) => {
                    if (success) {
                        jwt.sign({user: req.body.username}, 
                            "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c",
                            {algorithm: "HS256", expiresIn: "2h"}, 
                            (err, token) => {
                                console.log(token);
                                res.cookie('jwt', token);
                                if (req.body.redirect) {
                                    res.redirect(req.body.redirect);
                                } else {
                                    res.render('login', { redirect: req.query.redirect,
                                        success: true,
                                        failure: false});
                                }
                    });  
                    } else {
                        res.status(401);
                        res.render('login', { redirect: req.query.redirect,
                                                success: false,
                                                failure: true});
                    }
                });
            } else {
                res.status(401);
                res.render('login', { redirect: req.query.redirect,
                            success: false,
                            failure: true});
            }
        }).catch((err) => {
            next(err);
        })
    } else {
        return next(createError(400));
    }
});

module.exports = router;
