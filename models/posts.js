let util = require('util')
let client = require('../db');


function all(callback) {
    let collection = client.db('BlogServer').collection('Posts');
    collection.find().sort({postid: 1}).toArray((err, docs) => {
        callback(err, docs)
    });
}

module.exports.all = util.promisify(all);

function find(key, callback) {
    let collection = client.db('BlogServer').collection('Posts');
    collection.find(key).sort({postid: 1}).toArray((err, docs) => {
        callback(err, docs)
    });
}

module.exports.find = util.promisify(find);

function insert(doc, callback) {
    let collection = client.db('BlogServer').collection('Posts');
    collection.insert(doc, (err, rec) => {
        callback(err, rec)
    });
}

module.exports.insert = util.promisify(insert);

function update(query, update, callback) {
    let collection = client.db('BlogServer').collection('Posts');
    collection.updateOne(query, update, (err, rec) => {
        callback(err, rec)
    });
}

module.exports.update = util.promisify(update);

function remove(query, callback) {
    let collection = client.db('BlogServer').collection('Posts');
    collection.deleteOne(query, (err, rec) => {
        callback(err, rec)
    });
}

module.exports.remove = util.promisify(remove);