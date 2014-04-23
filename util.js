var fs = require('fs')

module.exports = {
  guid: guid,
  remove: remove,
  upload: upload
}

function remove(file) {
  fs.unlinkSync(file)
  console.log('successfully deleted ', file);
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

