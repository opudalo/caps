var koa = require('koa'),
  views = require('koa-views'),
  route = require('koa-route'),
  body = require('co-body'),
  serve = require('koa-static'),
  stylus = require('koa-stylus'),
  fs = require('fs'),
  logger = require('koa-logger'),
  parse = require('co-busboy'),

  _ = require('config').path

var app = koa()

app.use(logger())

app.use(serve('public'))

app.use(views(_.pages,'html', {
  'html': 'underscore'
}))

app.use(stylus('./public'))
app.use(route.get('/', index))
app.use(route.get('/manage', manage))
app.use(route.post('/people', people))
app.use(route.post('/add', cap))

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

function *people() {
  var data = yield body.json(this),
    file = 'people.json'

  writeToFile(_.data + file, data)
}

function *cap() {
  // multipart upload
  var parts = parse(this, {
      autoFields: true
    }),
    part,

    dir = _.img + 'caps/',
    cap = {
      id: guid(),
      frontImg: '/img/caps/',
      backImg: '/img/caps/',
      name: ''
    }

  while (part = yield parts) {
    var filename = guid() + '.' + part.mimeType.replace(/.*?\//,''),
      path = dir + filename
    
    cap[part.fieldname] += filename
    
    stream = fs.createWriteStream(path)
    part.pipe(stream);
    console.log('uploading %s -> %s', part.filename, stream.path);
  }


  cap.name = parts.field.name
  console.log('cap object created: ', cap)
  
  appendToFile( _.data + 'caps.json', cap )
  
  this.body = {ok : true, cap: cap}
}

function appendToFile( file, cap) {
  fs.readFile(file, 'utf8', onRead)

  function onRead(err, data) {
    if (err) return console.log('Error: ', err)
    var caps = JSON.parse(data)

    caps.push(cap)

    writeToFile(file, caps)

  }
}

function writeToFile(file, data){
  data = JSON.stringify(data, null, 2)

  fs.writeFile(file, data, function (err) { 
    if(err) console.log(err)
    else console.log(file + ' successfully updated')
  })
}

function writeFileIfNotExist(i){
    var i = i || 0;
    var fileName = 'a_' + i + '.jpg';
    fs.exists(fileName, function (exists) {
        if(exists){
            writeFile(++i);
        } else {
            fs.writeFile(fileName);
        }
    });
}

function *manage() {
  yield this.render('manage', {})
}

function *index() {
  yield this.render('index', {})
}

app.listen(3000)
