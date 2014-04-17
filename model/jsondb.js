var _ = require('underscore'),
  fs = require('fs')

module.exports = {
  get: get,
  add: add,
  del: del
}

function get() {
}

function add(db, obj) {
  extend(db, obj)
}

function del() {
}


function extend(db, obj) {
  fs.readFile(db, 'utf8', onRead)

  function onRead(err, data) {
    if (err) return console.log('Error: ', err)
    
    try {
      data = JSON.parse(data)
    } catch(err) {
      return console.log('Error Reading DB: ', err)
    } 
    
    write(db, _.extend(data, obj))
  }
}

function write(db, data){
  data = JSON.stringify(data, null, 2)

  fs.writeFile(db, data, function (err) { 
    if(err) console.log(err)
    else console.log(db + ' successfully updated')
  })
}


