var parse = require('co-busboy'),
  body = require('co-body'),
  db = require('./jsondb'),
  util = require('../util')


var path = require('../config').path,
  
  peopledb = path.data + 'people.json',
  capsImg = path.img + 'caps/'


module.exports = function (app) {
  return {
    get: get,
    add: add,
    update: update,
    del: del
  }
}

function *add(id) {
}

function *update(id) {
}

function *get(id) {
  var people = db.get(capsdb, id)

  this.body = {ok: true, caps: caps}
}

function *del(id) {
  var cap = db.get(capsdb, id)
  

  db.del(capsdb, id)
  console.log('cap deleted', id)
  
  this.body = {ok: true}
}

