var parse = require('co-busboy'),
  body = require('co-body'),
  db = require('./jsondb'),
  util = require('../util')


var path = require('../config').path,
  
  peopledb = path.data + 'people.json'


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

function *update(id, obj) {
  db.update(peopledb, obj)
  console.log('people updated', id, obj)
}

function *get(id) {
  var people = db.get(capsdb, id)

  this.body = {ok: true, people: people}
}

function *del(id) {
  var cap = db.get(capsdb, id)
  

  db.del(capsdb, id)
  console.log('cap deleted', id)
  
  this.body = {ok: true}
}

