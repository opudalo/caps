var parse = require('co-busboy'),
  db = require('./jsondb'),
  fs = require('fs')


var path = require('../config').path,
  capsdb = path.data + 'caps.json',
  capsImg = path.img + 'caps/'


module.exports = function (app) {
  return {
    all: all,
    add: add
  }
}

function *all() {
  
}

function *del() {

}

function *add() {
  var parts = parse(this, {
      autoFields: true
    }),
    part,
    
    id = guid(),
    cap = {}

  cap[id] = {
    id: id,
    frontImg: '',
    backImg: '',
    name: '',
    timestamp: Date.now()
  }

  while (part = yield parts) {
    var filename = guid() + '.' + part.mimeType.replace(/.*?\//,'')
    upload(capsImg + filename, part)
    
    cap[id][part.fieldname] += filename
  }

  cap[id].name = parts.field.name
 
  db.add(capsdb, cap)
  console.log('cap created: ', cap)

  this.body = {ok : true, cap: cap}
}

function upload(dest, file) {
  var stream = fs.createWriteStream(dest)

  file.pipe(stream)
  console.log('uploading %s -> %s', file.filename, stream.path)
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16).substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

