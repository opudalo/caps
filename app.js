var koa = require('koa'),
  views = require('koa-views'),
  route = require('koa-route'),
  body = require('co-body'),
  serve = require('koa-static'),
  stylus = require('koa-stylus'),
  fs = require('fs'),
  logger = require('koa-logger'),
  parse = require('co-busboy'),

  _ = require('config').path,
  util = require('./util')

  

var app = koa(),
  capModel = require('model/caps')(app),
  peopleModel = require('model/people')(app)

app.use(logger())

app.use(serve('public'))

app.use(views(_.pages,'html', {
  'html': 'underscore'
}))

app.use(stylus('./public'))



app.use(route.get('/', index))
app.use(route.get('/manage', manage))

app.use(route.put('/people', people))
app.use(route.post('/give', give))
app.use(route.post('/caps', capModel.add))
app.use(route.delete('/caps/:id', capModel.del))

function *give() {
  var data = yield body.json(this),
    cap = data.cap,
    people = data.people

  yield capModel.update(cap.id, cap)
  yield peopleModel.update(people.id, people)

} 
function *people() {
  var data = yield body.json(this),
    file = 'people.json'
  

  
  writeToFile(_.data + file, data.people)

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
