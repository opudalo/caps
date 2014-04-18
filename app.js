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

  

var app = koa(),
  capModel = require('model/caps')(app)

app.use(logger())

app.use(serve('public'))

app.use(views(_.pages,'html', {
  'html': 'underscore'
}))

app.use(stylus('./public'))
app.use(route.get('/', index))
app.use(route.get('/manage', manage))
app.use(route.post('/people', people))
app.use(route.post('/add', capModel.add))

function *people() {
  var data = yield body.json(this),
    file = 'people.json'

  writeToFile(_.data + file, data)
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
