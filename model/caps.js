var parse = require('co-busboy'),
  body = require('co-body'),
  db = require('./jsondb'),
  util = require('../util')


var path = require('../config').path,
  
  capsdb = path.data + 'caps.json',
  capsImg = path.img + 'caps/'


module.exports = function (app) {
  return {
    get: get,
    add: add,
    update: update,
    del: del
  }
}

function *get(id) {
  var caps = db.get(capsdb, id)

  this.body = {ok: true, caps: caps}
}

function *update(id, obj) {
  db.update(capsdb, obj)
  console.log('cap updated', id, obj)
}

function *del(id) {
  var cap = db.get(capsdb, id)
  
  util.remove(path.public + cap.frontImg)
  
  // Temporary backImg can not be removed 
  // it's the same for all caps
  //util.remove(path.public + cap.backImg)

  db.del(capsdb, id)
  console.log('cap deleted', id)
  
  this.body = {ok: true}
}

function *add() {
  var parts = parse(this, {
      autoFields: true
    }),
    part,
    
    cap = {
      id: util.guid(),
      frontImg: 'img/caps/',
      backImg: 'img/caps/',
      name: '',
      timestamp: Date.now()
    }

  while (part = yield parts) {
    var filename = util.guid() + '.' + part.mimeType.replace(/.*?\//,'')
    util.upload(capsImg + filename, part)
    
    cap[part.fieldname] += filename
  }

  cap.name = parts.field.name
 
  db.add(capsdb, cap)
  console.log('cap created: ', cap)

  this.body = {ok : true, cap: cap}
}

