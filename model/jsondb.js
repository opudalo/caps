var _ = require('underscore'),
  fs = require('fs')

module.exports = {
  get: get,
  add: add,
  update: update,
  del: del
}

function get(db, id) {
  var file = fs.readFileSync(db, 'utf8'),
    data

  try {
    data = JSON.parse(file)
  } catch(err) {
    return console.log('Error Reading DB: ', err)
  } 

  if (id) return data[id]

  return data
}

function add(db, obj) {
  var o = {}
  o[obj.id] = obj

  extend(db, o)
}

function update(db, obj) {
  var o = {}
  o[obj.id] = obj
  
  extend(db, o)
}

function del(db, id) {
  var data = get(db)
  if (!data) return

  delete data[id]
  write(db, data)
}




function extend(db, obj) {
  var data = get(db)
  if (!data) return
  write(db, _.extend(data, obj))
}

function write(db, data){
  data = JSON.stringify(data, null, 2)

  fs.writeFile(db, data, function (err) { 
    if(err) console.log(err)
    else console.log(db + ' successfully updated')
  })
}


