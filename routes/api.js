var express = require('express');
var router = express.Router();

var createError = require('http-errors');
let jwt = require('jsonwebtoken');
let posts = require('../models/posts');

router.get('/:username', function(req, res, next) {
    if (!req.cookies.jwt) {
        return res.sendStatus(401);
    }
    jwt.verify(req.cookies.jwt, 
        "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c", 
        (err, token) => {
            if (err || token.user != req.params.username) {
                return res.sendStatus(401);
            } else {
                posts.find({username: req.params.username}).then((data) => {
                    res.json(data);
                });
            }
    });
});

router.get('/:username/:postid', function(req, res, next) {
    if (!req.cookies.jwt) {
        return res.sendStatus(401);
    }
    jwt.verify(req.cookies.jwt, 
        "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c", 
        (err, token) => {
            if (err || token.user != req.params.username) {
                return res.sendStatus(401);
            } else {
                posts.find({username: req.params.username, postid: parseInt(req.params.postid)}).then((data) => {
                    if (data.length === 0) {
                        return res.sendStatus(404)
                    } else {
                        res.json(data[0]);
                    }
                })
            }
    });
});

router.post('/:username/:postid', function(req, res, next) {
    if (!req.cookies.jwt) {
        return res.sendStatus(401);
    }
    jwt.verify(req.cookies.jwt, 
        "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c", 
        (err, token) => {
            if (err || token.user != req.params.username) {
                return res.sendStatus(401);
            } else {
                posts.find({username: req.params.username, postid: parseInt(req.params.postid)})
                .then((data) => {
                    if (data.length === 0 && req.body.title && req.body.body) {
                        let time = new Date();
                        posts.insert({postid: parseInt(req.params.postid),
                                        username: req.params.username,
                                        created: time.getTime(),
                                        modified: time.getTime(),
                                        title: req.body.title,
                                        body: req.body.body})
                        .then((err, rec) => {
                            res.sendStatus(201);
                        }).catch((err) => {
                            next(err);
                        });
                    } else {
                        return res.sendStatus(400);
                    }
                });
            }
    });
});

router.put('/:username/:postid', function(req, res, next) {
    if (!req.cookies.jwt) {
        return res.sendStatus(401);
    }
    jwt.verify(req.cookies.jwt, 
        "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c", 
        (err, token) => {
            if (err || token.user != req.params.username) {
                return res.sendStatus(401);
            } else {
                posts.find({username: req.params.username, postid: parseInt(req.params.postid)})
                .then((data) => {
                    if (data.length !== 0 && req.body.title && req.body.body) {
                        let time = new Date();
                        posts.update({postid: parseInt(req.params.postid),
                                        username: req.params.username},
                                        {$set: {
                                            title: req.body.title,
                                            body: req.body.body,
                                            modified: time.getTime()
                                        }})
                        .then((err, rec) => {
                            res.sendStatus(200);
                        }).catch((err) => {
                            next(err);
                        });
                    } else {
                        return res.sendStatus(400);
                    }
                });
            }
    });
});

router.delete('/:username/:postid', function(req, res, next) {
    if (!req.cookies.jwt) {
        return res.sendStatus(401);
    }
    jwt.verify(req.cookies.jwt, 
        "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c", 
        (err, token) => {
            if (err || token.user != req.params.username) {
                return res.sendStatus(401);
            } else {
                posts.find({username: req.params.username, postid: parseInt(req.params.postid)}).then((data) => {
                    if (data.length === 0) {
                        return res.sendStatus(400)
                    } else {
                        posts.remove({username:req.params.username,
                                        postid: parseInt(req.params.postid)})
                        .then((err, rec) => {
                            res.sendStatus(204);
                        })
                    }
                })
            }
    });
});

module.exports = router;