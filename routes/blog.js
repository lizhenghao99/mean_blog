var express = require('express');
var router = express.Router();

var createError = require('http-errors');
let posts = require('../models/posts');
let commonmark = require('commonmark');

router.get('/:username/:postid', function(req, res, next) {
    posts.find({postid: parseInt(req.params.postid, 10), username: req.params.username})
    .then((data) => {
        if (data.length === 0) {
            return next(createError(404));
        } 
        let reader = new commonmark.Parser();
        let writer = new commonmark.HtmlRenderer();
        let parsedTitle = reader.parse(data[0].title);
        let parsedBody = reader.parse(data[0].body);
        let renderedTitle = writer.render(parsedTitle);
        let renderedBody = writer.render(parsedBody);
        res.render('preview', {title: renderedTitle, 
                                body: renderedBody, 
                                single: true});
    }).catch((err) => {
        next(err);
    });
});

router.get('/:username', function(req, res, next) {
    posts.find({username: req.params.username})
    .then((data) => {
        if (data.length === 0) {
            return next(createError(404));
        }
        
        let reader = new commonmark.Parser();
        let writer = new commonmark.HtmlRenderer();
        let titles = [];
        let bodies = [];

        let start = -1;
        if (req.query.start) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].postid >= req.query.start) {
                    start = i;
                    break;
                } 
            }
            if (start == -1) {
                return next(createError(404));
            }
        } else {
            start = 0
        }
    
        let end = data.length-start > 5 ? start+5 : data.length
        for (let i = start; i < end; i++) {
            let parsedTitle = reader.parse(data[i].title);
            let parsedBody = reader.parse(data[i].body);
            titles[i] = writer.render(parsedTitle);
            bodies[i] = writer.render(parsedBody);
        }
        let url = null;
        if (end < data.length) {
            url = `/blog/${req.params.username}?start=${data[end-1].postid+1}`;
        }
        res.render('preview', {titles: titles, 
                                bodies: bodies,
                                start: start,
                                end: end,
                                url: url, 
                                single: false});
    
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
