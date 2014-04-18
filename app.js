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

app.use(route.put('/people', people))
app.use(route.post('/caps', capModel.add))
app.use(route.delete('/caps/:id', capModel.del))

function *people() {
  var data = yield body.json(this),
    file = 'people.json'
  
  writeToFile(_.data + file, data.people)

 // var cap = capModel.get(data.capId)
 // console.log(this.body, cap)


}

function writeToFile(file, data){
  data = JSON.stringify(data, null, 2)

  fs.writeFile(file, data, function (err) { 
    if(err) console.log(err)
    else console.log(file + ' successfully updated')
  })
}

function *manage() {
  yield this.render('manage', {})
}

function *index() {
  yield this.render('index', {})
}

app.listen(3000)
