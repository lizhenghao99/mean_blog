let util = require('util')
let client = require('../db');


function all(callback) {
    let collection = client.db('BlogServer').collection('Users');
    collection.find().toArray((err, docs) => {
        callback(err, docs)
    });
}

module.exports.all = util.promisify(all);

function find(key, callback) {
    let collection = client.db('BlogServer').collection('Users');
    collection.find(key).toArray((err, docs) => {
        callback(err, docs)
    });
}

module.exports.find = util.promisify(find);