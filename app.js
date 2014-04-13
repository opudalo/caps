var koa = require('koa'),
  views = require('koa-views'),
  route = require('koa-route'),
  body = require('co-body'),
  serve = require('koa-static'),
  stylus = require('koa-stylus'),
  fs = require('fs'),

  _ = require('config').path

var app = koa()

app.use(serve('public'))

app.use(views(_.pages,'html', {
  'html': 'underscore'
}))

app.use(stylus('./public'))
app.use(route.get('/', index))
app.use(route.post('/people', people))

function *people() {
  var data = yield body.json(this),
    file = 'people.json'

  data = JSON.stringify(data, null, 2)
  
  fs.writeFile(_.data + file, data, function (err) { 
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

function *index() {
  yield this.render('index', {})
}

app.listen(3000)
